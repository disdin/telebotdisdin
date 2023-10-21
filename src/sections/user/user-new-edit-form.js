import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect, useContext, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// hooks
import { useLocation } from 'react-router';
import { fetchInterviewRoles } from 'src/services/role.service';
import { AuthContext } from 'src/auth/context/jwt';
import { LoadingScreen } from 'src/components/loading-screen';
import CreateJobForm from './forms/create-job-form';
import EnterNoOfQuesForm from './forms/enter-no-of-ques-form';
import AddQuesForm from './forms/add-ques-form';
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function JobNewEditForm({ currentJob }) {
  // contexts
  const context = useContext(AuthContext);

  // states
  const [loading, setLoading] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState(0);
  const [jobOpeningId, setJobOpeningId] = useState('');
  const [jobOpeningName, setJobOpeningName] = useState('');
  const [interviewType, setInterviewType] = useState('STRUCTURED');
  const [validTill, setValidTill] = useState('');
  const [duration, setDuration] = useState(0);
  const [language, setLanguage] = useState('en');
  const [questions, setQuestions] = useState([]);
  const [state, setState] = useState('');
  // states: INITIAL, ENTER_NO_OF_QUES, ADD_QUES

  // router
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  useEffect(() => {
    if (queryParams.size && context.organizations.length) {
      setState(queryParams.get('state'));
      setJobOpeningId(queryParams.get('jobOpeningId'));

      fetchInterviewRoles(context.organizations[0].organization_id)
        .then(roles => {
          roles.body.forEach(role => {
            if (role.job_opening_id === jobOpeningId) {
              setJobOpeningName(role.name);
              setDuration(5400);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [context.organizations, jobOpeningId, queryParams]);

  const [jobCreationState, setJobCreationState] = useState('INITIAL');

  // schema
  const NewJobSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    skills: Yup.array().min(1, 'Choose at least one option'),
    experience: Yup.string(),
  });

  const InterviewQuestionsSchema = Yup.object().shape({
    language: Yup.string().required(),
    no_of_ques: Yup.string()
      .required('Enter number of questions')
      .test(
        'is-valid-int',
        'Number of questions must be between 1 and 10',
        value => {
          const intValue = parseInt(value, 10);
          return Number.isInteger(intValue) && intValue >= 1 && intValue <= 10;
        },
      ),
  });

  // variables
  const defaultValuesJob = useMemo(
    () => ({
      title: currentJob?.title || '',
      content: currentJob?.content || '',
      experience: currentJob?.experience || '1 year exp',
      skills: currentJob?.skills || [],
    }),
    [currentJob],
  );

  const defaultValuesInterview = useMemo(
    () => ({
      no_of_ques: currentJob?.no_of_ques || '5',
      language: currentJob?.language || 'en',
    }),
    [currentJob],
  );

  const InterviewQuestionsMethods = useForm({
    resolver: yupResolver(InterviewQuestionsSchema),
    defaultValues: defaultValuesInterview,
  });

  const JobMethods = useForm({
    resolver: yupResolver(NewJobSchema),
    defaultValues: defaultValuesJob,
  });

  const [methods, setMethods] = useState(JobMethods);

  // functions
  const renderProperties = () => {
    if (jobCreationState === 'INITIAL')
      return (
        <CreateJobForm
          setDuration={setDuration}
          setJobCreationState={setJobCreationState}
          setJobOpeningId={setJobOpeningId}
          jobCreationState={jobCreationState}
          setJobOpeningName={setJobOpeningName}
          setLoading={setLoading}
        />
      );
    if (jobCreationState === 'ENTER_NO_OF_QUES')
      return (
        <EnterNoOfQuesForm
          duration={duration}
          interviewType={interviewType}
          jobOpeningId={jobOpeningId}
          jobOpeningName={jobOpeningName}
          jobCreationState={jobCreationState}
          setInterviewQuestions={setInterviewQuestions}
          setJobCreationState={setJobCreationState}
          setLanguage={setLanguage}
          setLoading={setLoading}
          setQuestions={setQuestions}
          setValidTill={setValidTill}
        />
      );
    if (jobCreationState === 'ADD_QUES')
      return (
        <AddQuesForm
          questions={questions}
          setQuestions={setQuestions}
          jobCreationState={jobCreationState}
          setJobCreationState={setJobCreationState}
          jobOpeningId={jobOpeningId}
          setLoading={setLoading}
        />
      );
  };

  // effects
  useEffect(() => {
    if (state) setJobCreationState(state);
  }, [state]);

  useEffect(() => {
    if (jobCreationState === 'ENTER_NO_OF_QUES')
      setMethods(InterviewQuestionsMethods);
    else if (jobCreationState === 'INITIAL') setMethods(JobMethods);
  }, [InterviewQuestionsMethods, JobMethods, jobCreationState]);

  useEffect(() => {
    if (currentJob) {
      methods.reset(defaultValuesJob);
    }
  }, [currentJob, defaultValuesJob, methods]);

  return (
    <>
      {' '}
      {loading !== '' && 
        <Stack sx={{minHeight:"80vh",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <LoadingScreen loadingText={loading} />
        </Stack>
      }
      {loading === '' && renderProperties()}
    </>
  );
}

JobNewEditForm.propTypes = { currentJob: PropTypes.object };
