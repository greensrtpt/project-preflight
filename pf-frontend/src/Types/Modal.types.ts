

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic_id:string;
  group_id:string;
  topic_name:string;
  group_name:string;
}

export interface CreatePostClicked {
  onClick: () => void;
}

export interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post_id:string
  group_id:string;
  topic_name:string;
  group_name:string;
  old_title: string;
  old_description: string;
}

export interface EditPostClicked {
  onClick: () => void;
}