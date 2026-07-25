
export interface Group {
  group_id:string;
  topic_id:string;
  group_name:string;
}

export interface DataFromTopic {
  topic_id: string;
  topic_name: string;
  group: Group[]; 
}

export interface Post {
  // รหัสโพสต์
  post_id: string
  group_id: string
  title: string
  descriptions: string
  author_id: string
  author_name: string
  edit_at: string
}

export interface DataFromGroup {
  group_id: string;
  group_name: string;
  post: Post[]; 
}
