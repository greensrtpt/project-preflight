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