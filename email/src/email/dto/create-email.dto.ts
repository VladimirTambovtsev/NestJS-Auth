export class CreateEmailDto {
  from: string;
  to: string;
  subject: string;
  confirmLink: string;
}
