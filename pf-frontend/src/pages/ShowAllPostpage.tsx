import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DataFromGroup } from '../Types/APIresultFromHomePage.types';
import Header from '../components/Header';
import CreateNewPost from "../components/CreateNewPost";
import CreatePostModal from '../components/CreatePostModal';
import EditPostModal from '../components/EditPostModal';
import { useAuth } from '../context/AuthContext';
import { authStorage } from '../utils/storage';
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { Background } from '../components/Background';
import Cardcolors from '../constants/Cardcolors'

const ShowAllPostpage: React.FC = () => {
  const navigate = useNavigate();
  const { topic_id, group_id } = useParams<{ topic_id: string; group_id: string }>();
  
  const [Data, setData] = useState<DataFromGroup | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>('');
  const [topicName, settopicName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const { username } = useAuth(); 
  const isLogIn = Boolean(username);
  
  const [CreatePost, setCreatePost] = useState<boolean>(false);
  const [EditPost, setEditPost] = useState<boolean>(false);
  
  // 🌟 States สำหรับส่งไปให้ EditPostModal
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const backToShowAllGroup = () => {
    navigate(`/showAllGroup/${topic_id}`);
  };

  // 🌟 1. ฟังก์ชันดึงโพสต์ทั้งหมดในกลุ่ม
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/posts/${group_id}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      
      const resultGroup = (await res.json()) as DataFromGroup;
      setData(resultGroup);
      setGroupName(resultGroup.group_name);
      settopicName(resultGroup.topic_name);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic_id && group_id) {
      fetchGroups();
    }
  }, [topic_id, group_id]);

  // 🌟 2. เปิด Modal สร้างโพสต์
  const handlCreatePost = () => {
    setEditPost(false);
    setCreatePost(true);
    setIsModalOpen(true);
  };

  // 🌟 3. เปิด Modal แก้ไขโพสต์ (รับ item ที่เป็น Post Object แต่ละตัว)
  const handleEditPost = (item: any) => {
    setCreatePost(false);
    setEditPost(true);
    setSelectedPostId(item.post_id);
    setTitle(item.title);
    setDescription(item.descriptions);
    setIsModalOpen(true);
  };

  // 🌟 4. ฟังก์ชันลบโพสต์
  const handleDeletePost = async (post_id: string) => {
    const isConfirm = window.confirm("Are you sure to delete this post?");
    if (!isConfirm) return;

    const token = authStorage.getToken();
    if (!token) {
      alert("Please log in before delete post");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/posts/${group_id}/${post_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Delete post success!");
        fetchGroups(); // ดึงข้อมูลใหม่มาอัปเดตหน้าจอทันที
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Something went wrong, can not delete post");
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert("Something went wrong with server");
    }
  };

  if (Loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl animate-pulse">
        Loading posts...
      </div>
    );
  }   

  return (
    <Background>
    <div className="p-8 md:p-12">
      <div>
        <Header onClickBack={backToShowAllGroup} showName={groupName} placeholder="Posts" />
      </div>

      <div className="flex flex-col gap-4 max-w-4xl mx-auto pt-[90px] ">
        {/* ปุ่ม CreateNewPost */}
        {isLogIn && <CreateNewPost onClick={handlCreatePost}/>}

        {/* แสดงรายการโพสต์ */}
        {Data?.post && Data.post.length > 0 ? (
          Data.post.map((item,index) => { 
            const colorStyle = Cardcolors[index % Cardcolors.length];
            return (
            
            <div
              key={item.post_id}
              className={`${colorStyle} p-6 rounded-2xl border-2 border-[#626161] shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between gap-4`}
            >
              <div>
                <h2 className="text-xl font-bold text-[#626161] leading-snug">
                  {item.title}
                </h2>
                <p className="text-sm text-[#626161] leading-relaxed mt-2">
                  {item.descriptions}
                </p>
              </div>

              <div className="flex items-end justify-between text-xs text-[#626161] pt-3 border-t border-gray-100 mt-auto">
                <div className="flex flex-col justify-start gap-1">
                  <span className="font-medium truncate max-w-[200px] text-gray-500">
                    Author : {item.author_name}
                  </span>
                  <span className="shrink-0 text-gray-500">
                    Edited At : {item.edit_at
                      ? new Date(item.edit_at).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit' 
                        })
                      : ''}
                  </span>
                </div>

                {/* ปุ่ม Edit / Delete */}
                {item.author_name === username && (
                  <div className="flex items-center gap-4 text-2xl text-gray-500">
                    <button
                      onClick={() => handleEditPost(item)}
                      className="hover:text-blue-600 transition-colors p-1"
                      title="Edit post"
                    >
                      <RiEdit2Fill />
                    </button>
                    <button
                      onClick={() => handleDeletePost(item.post_id)}
                      className="hover:text-red-600 transition-colors p-1"
                      title="Delete post"
                    >
                      <MdDelete />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )})
        ) : (
          <div className="text-center text-gray-400 py-12 text-lg">
            No posts available for this group.
          </div>
        )}
      </div>

      {/* Modal สำหรับสร้างโพสต์ */}
      {CreatePost && (
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          topic_id={topic_id || ''}
          group_id={group_id || ''}
          group_name={groupName}
          topic_name={topicName}
        />
      )}

      {/* Modal สำหรับแก้ไขโพสต์ */}
      {EditPost && (
        <EditPostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post_id={selectedPostId}
          group_id={group_id || ''}
          group_name={groupName}
          topic_name={topicName}
          old_title={title}
          old_description={description}
        />
      )
      }
    </div>
    </Background>
  );
};

export default ShowAllPostpage;