//POST

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic_id?:string;
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

//GROUP

// export interface EditGroupModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   topic_id:string,
//   group_name: string,
//   owner_id:string,
//   owner_name:string,
//   old_groupName: string;
// }

export interface CreateGroupClicked {
  onClick: () => void;
}

export interface CreateGroupCardProps {
  onSubmit: (groupName: string) => Promise<void>;
  onCancel: () => void;
  topic_id:string;
}

export interface EditGroupCardProps {
  onSubmit: (groupName: string) => Promise<void>;
  onCancel: () => void;
  group_id:string;
  topic_id:string;
  old_groupname:string;
}

// export interface EditGroupClicked {
//   onClick: () => void;
// }