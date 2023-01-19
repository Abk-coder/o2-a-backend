export interface AllergyInterface extends Document {
  postId: any;
  posterId: any;
  specialistId: any;
  allergyName: string;
  description: string;
  clinicSigns: string[];
  symptoms: string[];
}
