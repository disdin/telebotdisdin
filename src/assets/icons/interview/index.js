import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as SendMailSvg } from './send_mail.svg';
import { ReactComponent as MailSentSvg } from './mail_sent.svg';
import { ReactComponent as LinkSvg } from './link.svg';

export const LinkIcon = props => (
  <SvgIcon {...props}>
    <LinkSvg />
  </SvgIcon>
);

export const MailSentIcon = props => (
  <SvgIcon {...props}>
    <MailSentSvg />
  </SvgIcon>
);

export const SendMailIcon = props => (
  <SvgIcon {...props}>
    <SendMailSvg />
  </SvgIcon>
);
