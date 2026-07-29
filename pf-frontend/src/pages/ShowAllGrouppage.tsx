import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { DataFromTopic } from '../Types/APIresultFromHomePage.types';
import Header from '../components/Header';
import { Background } from '../components/Background';
import Cardcolors from '../constants/Cardcolors';
import CreateNewGroup from '../components/Group/CreateNewGroup';
import { CreateGroupCard } from '../components/Group/CreateGroupCard';
import { EditGroupCard } from '../components/Group/EditGroupCard';
import { useAuth } from '../context/AuthContext';
import { authStorage } from '../utils/storage';
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";

const ShowAllGrouppage: React.FC = () => {
  const navigate = useNavigate();
  const { topic_id } = useParams<{ topic_id: string }>();
  const [Data, setData] = useState<DataFromTopic | null>(null);
  const [Loading, setLoading] = useState<boolean>(false);
  const [topicName, setTopicName] = useState<string>('');
  const { username } = useAuth(); 
  const isLogIn = Boolean(username);
  
  // State สำหรับเปิด/ปิดการสร้างกลุ่ม
  const [CreateGroup, setCreateGroup] = useState<boolean>(false);

  // 🌟 State สำหรับเก็บ ID ของกลุ่มที่กำลังกดแก้ไข (null = ไม่ได้แก้ไขกลุ่มไหนอยู่)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  // ฟังก์ชันยิง API ดึงกลุ่ม
  const fetchGroups = async () => {
    if (!topic_id) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/topics/${topic_id}`);
      if (!res.ok) throw new Error("Failed to fetch topic");
      const resultTopic = (await res.json()) as DataFromTopic;
      setData(resultTopic);
      setTopicName(resultTopic.topic_name);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [topic_id]);

  const handleSelectGroup = async (chooseGroup: string) => {
    if (!topic_id) return;
    navigate(`/showAllPost/${topic_id}/${chooseGroup}`);
  };

  const backToHomePage = () => {
    navigate(`/`);
  };

  const handleCreateGroup = () => {
    setEditingGroupId(null); // ปิดกล่องแก้ไข ถ้าเปิดกล่องสร้างใหม่
    setCreateGroup(true);
  };

  const handleStartEditGroup = (e: React.MouseEvent, group_id: string) => {
    e.stopPropagation(); // 👈 ป้องกันไม่ให้กดปุ่มแล้วเปลี่ยนหน้า
    setCreateGroup(false); // ปิดกล่องสร้าง ถ้ากำลังกดแก้ไข
    setEditingGroupId(group_id);
  };

  // 🌟 ฟังก์ชันจัดการส่งค่าสร้างกลุ่ม
  const handleCreateGroupSubmit = async (groupName: string) => {
    if (!topic_id) return;
    const token = authStorage.getToken();
    
    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/groups/${topic_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ group_name: groupName })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to create group");
        return;
      }

      setCreateGroup(false);
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Something went wrong with server");
    }
  };

  // 🌟 ฟังก์ชันจัดการส่งค่าแก้ไขกลุ่ม
  const handleEditGroupSubmit = async (groupId: string, newGroupName: string) => {
    if (!topic_id) return;
    const token = authStorage.getToken();

    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/groups/${topic_id}/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ group_name: newGroupName })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update group");
        return;
      }

      setEditingGroupId(null);
      fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
      alert("Something went wrong with server");
    }
  };


  const handleDeleteGroup = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation(); // 👈 ป้องกันไม่ให้กดปุ่มแล้วเปลี่ยนหน้า
    const isConfirm = window.confirm("Are you sure you want to delete this group?");
    if (!isConfirm) return;

    const token = authStorage.getToken();
    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/groups/${topic_id}/${groupId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchGroups();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Cannot delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Something went wrong with server");
    }
  };

  if (Loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl animate-pulse">
        Loading groups...
      </div>
    );
  }

  const currentTopicId = topic_id || '';

  return (
    <Background>
      <div className="p-4 md:p-12">
        <div>
          <Header onClickBack={backToHomePage} showName={topicName} placeholder="Groups" />
        </div>
        
        <div className="pt-[90px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* 1. ปุ่ม Create New Group */}
            {isLogIn && <CreateNewGroup onClick={handleCreateGroup} />}

            {/* 2. การ์ดสร้างกลุ่มใหม่ (แสดงเมื่อกด +) */}
            {isLogIn && CreateGroup && (
              <CreateGroupCard
                onSubmit={handleCreateGroupSubmit}
                onCancel={() => setCreateGroup(false)}
                topic_id={currentTopicId}
              />
            )}

            {/* 3. รายการการ์ดกลุ่มทั้งหมด */}
            {Data?.group && Data.group.length > 0 && (
              Data.group.map((item, index) => {
                const colorStyle = Cardcolors[index % Cardcolors.length];

                // 🌟 ถ้ากลุ่มนี้กำลังถูกกดแก้ไข ให้เปลี่ยนเป็นร่าง EditGroupCard ตรงนี้เลย
                if (editingGroupId === item.group_id) {
                  return (
                    <EditGroupCard
                      key={item.group_id}
                      onSubmit={(newName) => handleEditGroupSubmit(item.group_id, newName)}
                      onCancel={() => setEditingGroupId(null)}
                      group_id={item.group_id}
                      topic_id={currentTopicId}
                      old_groupname={item.group_name}
                    />
                  );
                }

                // การ์ดแสดงผลกลุ่มปกติ
                return (
                  <div
                    key={item.group_id}
                    className={`${colorStyle} aspect-square p-6 rounded-3xl border-[2.5px] border-black shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer`}
                    onClick={() => handleSelectGroup(item.group_id)}
                  >
                    <div>
                      <h2 className="text-xl font-bold text-[#626161] line-clamp-2">
                        {item.group_name}
                      </h2>
                    </div>

                    {item.owner_name === username && (
                      <div className="flex items-center gap-3 text-2xl text-gray-500 justify-end">
                        <button
                          className="hover:text-blue-600 transition-colors p-1"
                          title="Edit group"
                          onClick={(e) => handleStartEditGroup(e, item.group_id)}
                        >
                          <RiEdit2Fill />
                        </button>
                        <button
                          className="hover:text-red-600 transition-colors p-1"
                          title="Delete group"
                          onClick={(e) => handleDeleteGroup(e, item.group_id)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* กรณีไม่มีกลุ่มและไม่ได้ Log In */}
          {(!Data?.group || Data.group.length === 0) && !isLogIn && (
            <div className="text-center text-gray-400 py-20 text-lg">
              No groups available for this topic.
            </div>
          )}
        </div>
      </div>
    </Background>
  );
};

export default ShowAllGrouppage;