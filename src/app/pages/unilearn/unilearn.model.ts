export interface learnModules {
  id: number;
  module_name: string;
  module_icon: string;
}
export interface learnsubModules {
  data: submoduledata[];
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
}
