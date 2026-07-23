import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { DataFromTopic } from '../Types/APIresultFromSearchPage.types';

const ShowAllPostpage: React.FC = () => {
  // ดึง topicId ที่แนบมากับ URL ออกมาใช้ยิง API
  const { topic_id } = useParams<{ topic_id: string }>();
  const [Data,setData] = useState<DataFromTopic|null>(null)
  const [Loading,setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/topics/${topic_id}`);
        const resultTopic = (await res.json()) as DataFromTopic;
        setData(resultTopic);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (topic_id) {
      fetchPosts();
    }
    }, [topic_id]);

    if (Loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl animate-pulse">
        Loading posts...
      </div>
    );
   }

    return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      {/* แสดงชื่อ Topic */}
      <h1 className="text-4xl font-bold text-black mb-8 capitalize">
        Topic: {Data?.topic_name || 'Posts'}
      </h1>

      {/* 🌟 3. Grid Container: กำหนด grid-cols-1 ถึง grid-cols-4 เพื่อให้ปรับตามขนาดจอ */}
      {Data?.post && Data.post.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Data.post.map((item) => {
            console.log(item)
            return (
            /* 🌟 4. ก้อนการ์ดสี่เหลี่ยมแต่ละโพสต์ (แสดงเฉพาะ title, author_name, edit_at) */
            <div
              key={item.post_id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-[200px]"
            >
              {/* ส่วนบน: หัวข้อโพสต์ (Title) */}
              <div>
                <h2 className="text-xl font-bold text-black line-clamp-2 mb-2">
                  {item.title}
                </h2>
              </div>

              {/* ส่วนล่าง: ผู้เขียน และ วันที่แก้ไข (Author & Date) */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900 truncate">
                  <span className="text-gray-400 font-normal">By: </span>
                  {item.author_name}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.edit_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
          )}
        </div>
      ) : (
        /* กรณีหัวข้อนี้ยังไม่มีโพสต์เลย */
        <div className="text-center text-gray-400 py-20 text-lg">
          No posts available for this topic.
        </div>
      )}
    </div>
  );
}

export default ShowAllPostpage