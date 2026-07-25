import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { DataFromGroup } from '../Types/APIresultFromHomePage.types';
import { useNavigate } from 'react-router-dom';

const ShowAllPostpage: React.FC = () => {
      const navigate = useNavigate();
    // ดึง topicId ที่แนบมากับ URL ออกมาใช้ยิง API
    const { topic_id,group_id } = useParams<{ topic_id:string, group_id : string }>();
    const [Data,setData] = useState<DataFromGroup|null>(null)
    const [Loading,setLoading] = useState<boolean>(false)

      const backToShowAllGroup = () => {
        navigate(`/showAllGroup/${topic_id}`)
      }

      useEffect(() => {
        const fetchGroups = async () => {
          setLoading(true);
          try {
            const res = await fetch(`http://localhost:3001/posts/${topic_id}/${group_id}`);
            const resultGroup = (await res.json()) as DataFromGroup;
            setData(resultGroup);
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
            Loading groups...
          </div>
        );
       }    
  
      return (
      <div className="min-h-screen bg-gray-50 p-8 md:p-12">
        {/* แสดงชื่อ Topic */}
        <div className="flex items-start gap-3"
        onClick={backToShowAllGroup}>
    <svg 
      className="w-8 h-8 md:w-10 md:h-10 stroke-current stroke-[3]" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15 19l-7-7 7-7" 
      />
    </svg>
        <h1 className="text-4xl font-bold text-black mb-8 capitalize">
          Group: {Data?.group_name || 'Posts'}
        </h1>
        </div>
  
        {/* 🌟 3. Grid Container: กำหนด grid-cols-1 ถึง grid-cols-4 เพื่อให้ปรับตามขนาดจอ */}
        {Data?.post && Data.post.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {Data.post.map((item) => {
              console.log(item)
              return (
              /* 🌟 4. ก้อนการ์ดสี่เหลี่ยมแต่ละโพสต์ (แสดงเฉพาะ title, author_name, edit_at) */
              <div
                key={item.post_id}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-auto"
              >
                {/* ส่วนบน: หัวข้อโพสต์ (Title) */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.descriptions}
                  </p>
              </div>

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
            )}
            )}
          </div>
        ) : (
          /* กรณีหัวข้อนี้ยังไม่มีโพสต์เลย */
          <div className="text-center text-gray-400 py-20 text-lg">
            No groups available for this topic.
          </div>
        )}
      </div>
    );
}

export default ShowAllPostpage