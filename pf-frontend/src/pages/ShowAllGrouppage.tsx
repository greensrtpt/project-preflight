import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { DataFromTopic } from '../Types/APIresultFromHomePage.types';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Background } from '../components/Background';
import Cardcolors from '../constants/Cardcolors'

const ShowAllGrouppage: React.FC = () => {
  const navigate = useNavigate();
  // ดึง topicId ที่แนบมากับ URL ออกมาใช้ยิง API
  const { topic_id } = useParams<{ topic_id: string }>();
  const [Data,setData] = useState<DataFromTopic|null>(null)
  const [Loading,setLoading] = useState<boolean>(false)
  const [topicName,setTopicName] = useState<string>('');
      
  const handleSelectGroup = async (chooseGroup:string) => {
        navigate(`/showAllPost/${topic_id}/${chooseGroup}`);
  };

  const backToHomePage = () => {
        navigate(`/`)
      }

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/topics/${topic_id}`);
        const resultTopic = (await res.json()) as DataFromTopic;
        setData(resultTopic);
        setTopicName(resultTopic.topic_name)
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (topic_id) {
      fetchGroups();
    }
    }, [topic_id]);

    if (Loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl animate-pulse">
        Loading groups...
      </div>
    );
   }

    return (
      <Background>
    <div className="p-4 md:p-12">
        <div >
          <Header onClickBack={backToHomePage} showName={topicName} placeholder="Groups" />
        </div>
      {/* 🌟 3. Grid Container: กำหนด grid-cols-1 ถึง grid-cols-4 เพื่อให้ปรับตามขนาดจอ */}
      {Data?.group && Data.group.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-[90px]">
          {Data.group.map((item,index) => {
            const colorStyle = Cardcolors[index % Cardcolors.length];
            return (
            /* 🌟 4. ก้อนการ์ดสี่เหลี่ยมแต่ละโพสต์ (แสดงเฉพาะ title, author_name, edit_at) */
            <div
              key={item.group_id}
              className={`${colorStyle} p-6 rounded-2xl border-2 border-[#626161] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[220px] cursor-pointer`}
              onClick={()=>handleSelectGroup(item.group_id)}
            >
              {/* ส่วนบน: หัวข้อโพสต์ (Title) */}
              <div>
                <h2 className="text-xl font-bold text-[#626161] line-clamp-2 mb-2">
                  {item.group_name}
                </h2>
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
    </Background>
  );
}

export default ShowAllGrouppage