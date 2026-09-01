import { api } from "@/lib/axios";
import { useState, useEffect } from "react";

export function useLeaveRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    setLoading(true);
    const res = await api.get("/leave");
    setData(res.data);
    setLoading(false);
  };

  const applyLeave = (payload: any) => api.post("/leave", payload).then(fetchLeaves);
  const approveLeave = (id: string, status: string, comment?: string) =>
    api.patch(`/leave/${id}/approve`, { status, adminComment: comment }).then(fetchLeaves);

  useEffect(() => { fetchLeaves(); }, []);

  return { data, loading, applyLeave, approveLeave };
}