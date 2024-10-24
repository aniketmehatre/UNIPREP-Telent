export interface learnModules {
  id: number;
  module_name: string;
  module_icon: string;
}
export interface learnsubModules {
  data: submoduledata[];
  userAnsweredQuestions: number;
  totalQuestions: number;
  previous_id: number;
}
export interface submoduledata {
  id: number;
  module_id: number;
  parent_folder_id: number;
  submodule_name: string;
  file_type: number;
  icon: string;
  attachment_filename: string;
  submodule_type: number;
  isTestmodule: number;
  time_limit: number;
  score_type: number;
  min_score: number;
  max_score: number;
  grades: string;
  totalQuestions: number;
  userAnsweredQuestions: number;
}
export interface Quizmodule {
  shuffledQuestion: shuffledQuestion[];
  primary_question: primary_question[];
  totalquestion: number;
}
export interface shuffledQuestion {
  id: number;
  module_id: number;
  test_type_module_id: number;
  test_module_id: number;
  question: string;
  status: string;
  type_id: number;
  type: string;
  created_at: string;
  updated_at: string;
  options:[];
}
export interface primary_question {
  id: number;
  module_id: number;
  code: string;
  type: number;
  title: string;
  description: string;
  audio_path: string;
  image_path: string;
  status: number;
  created_at: string;
  updated_at: string;
  audio_file: string;
  image_file: string;
  audio: number;
  image: number;
  paragraph: number;
}
export interface SelectedOption {
  question: number;
  options: number[];
}