import { ResetPasswordTokenStatus } from '../model/authentication/reset-password-token-status'

export const resetPasswordIssueTexts = [
  {
    status: ResetPasswordTokenStatus.Expired,
    title: 'Link per il reset della password scaduto',
    text: 'Il link per il ripristino della password è stato generato da più di 24 ore.'
  },
  {
    status: ResetPasswordTokenStatus.NotFound,
    title: 'Link per il reset della password non trovato',
    text: 'Impossibile trovare il link specificato per il ripristino della password.'
  },
  {
    status: ResetPasswordTokenStatus.Used,
    title: 'Link già utilizzato',
    text: 'Il link specificato per il ripristino della password è già stato utilizzato.'
  }
]
