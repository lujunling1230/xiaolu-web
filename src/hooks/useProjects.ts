/**
 * useProjects Hook
 *
 * 组件挂载时先返回本地缓存数据，随后异步拉取远程最新数据并更新状态。
 * 解决纯 localStorage 方案下不同设备数据不同步的问题。
 */

import { useState, useEffect } from "react";
import { getProjects, fetchProjects } from "../utils/projectStore";
import type { Project } from "../data/projects";

export function useProjects(): Project[] {
  const [projects, setProjects] = useState<Project[]>(() => getProjects());

  useEffect(() => {
    let cancelled = false;
    fetchProjects().then((remote) => {
      if (!cancelled && remote) {
        setProjects(remote);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return projects;
}
