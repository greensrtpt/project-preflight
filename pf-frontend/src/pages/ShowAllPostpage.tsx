import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { DataFromGroup } from '../Types/APIresultFromHomePage.types';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CreateNewPost from "../components/CreateNewPost";
import CreatePostModal from '../components/CreatePostModal';
import { useAuth } from '../context/AuthContext';

const ShowAllPostpage: React.FC = () => {
      const navigate = useNavigate();
    // ดึง topicId ที่แนบมากับ URL ออกมาใช้ยิง API
    const { topic_id,group_id } = useParams<{ topic_id:string, group_id : string }>();
    const [Data,setData] = useState<DataFromGroup|null>(null)
    const [Loading,setLoading] = useState<boolean>(false)
    const [groupName,setGroupName] = useState<string>('')
    const [topicName,settopicName] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { username } = useAuth(); 
    const isLogIn = Boolean(username);

      const backToShowAllGroup = () => {
        navigate(`/showAllGroup/${topic_id}`)
      }

      useEffect(() => {
        const fetchGroups = async () => {
          setLoading(true);
          try {
            const res = await fetch(`http://localhost:3001/posts/${group_id}`);
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
    
        if (topic_id && group_id) {
          fetchGroups();
        }
        }, [topic_id, group_id]);
    
        if (Loading) {
        return (
          <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl animate-pulse">
            Loading posts...
          </div>
        );
       }    
  
      return (
  <div className="min-h-screen bg-gray-50 p-8 md:p-12">
    <div>
      <Header onClickBack={backToShowAllGroup} showName={groupName} placeholder="Posts" />
    </div>

    <div className="flex flex-col gap-4 max-w-4xl mx-auto pt-[90px]">
      {/* 🌟 ปุ่ม CreateNewPost จะโชว์ตรงนี้เสมอ */}
      {isLogIn && <CreateNewPost onClick={() => {setIsModalOpen(true)}}/>}

      {/* 🌟 3. เงื่อนไขแสดงรายการโพสต์ */}
      {Data?.post && Data.post.length > 0 ? (
        Data.post.map((item) => (
          <div
            key={item.post_id}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between gap-4"
          >
            {/* ส่วนบน: หัวข้อโพสต์ (Title) และรายละเอียด */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                {item.descriptions}
              </p>
            </div>

            {/* ส่วนล่าง: ชื่อผู้เขียน และ วันที่ */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 mt-auto">
              <span className="font-medium truncate max-w-[50%]">
                {item.author_name}
              </span>
              <span className="shrink-0">
                {item.edit_at
                  ? new Date(item.edit_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''}
              </span>
            </div>
          </div>
        ))
      ) : (
        /* กรณีหัวข้อนี้ยังไม่มีโพสต์เลย */
        <div className="text-center text-gray-400 py-12 text-lg">
          No posts available for this group.
        </div>
      )}
    </div>
    <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // สั่งปิด Modal
        topic_id={topic_id || ''}
        group_id={group_id || ''}
        group_name={groupName}
        topic_name={topicName}
      />
  </div>
);
}

export default ShowAllPostpage