import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { initPageTracking } from "./utils/track";
import App from "./App";
import ToolboxHome from "./pages/toolbox/ToolboxHome";
import ToolboxDetail from "./pages/toolbox/ToolboxDetail";
import InventoryPage from "./pages/toolbox/InventoryPage";
import QuestLogPage from "./pages/toolbox/QuestLogPage";
import RechargePage from "./pages/toolbox/RechargePage";
import MuseumPage from "./pages/toolbox/MuseumPage";
import StressReliefPage from "./pages/toolbox/StressReliefPage";
import BadgeWallPage from "./pages/toolbox/games/BadgeWallPage";
import TravelPage from "./pages/toolbox/TravelPage";
import RoamingGuideLayout from "./pages/toolbox/roaming-guide/RoamingGuideLayout";
import MapPage from "./pages/toolbox/roaming-guide/MapPage";
import CitiesPage from "./pages/toolbox/roaming-guide/CitiesPage";
import PlanPage from "./pages/toolbox/roaming-guide/PlanPage";
import AboutPage from "./pages/toolbox/roaming-guide/AboutPage";
import ProfilePage from "./pages/toolbox/roaming-guide/ProfilePage";
import { RoamingGuideProvider } from "./pages/toolbox/roaming-guide/RoamingGuideContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { StandaloneProvider } from "./context/StandaloneContext";
import { UserAuthProvider } from "./context/UserAuthContext";
import SystemTuningPage from "./pages/toolbox/SystemTuningPage";
import BanlingPage from "./pages/toolbox/BanlingPage";
// LifeFilmPage removed - module deleted
import HealingRoomPage from "./pages/HealingRoomPage";
import MusicPage from "./pages/toolbox/MusicPage";
import MickeyLaunchpad from "./pages/MickeyLaunchpad";
import BookstoreIndex from "./pages/BookstoreIndex";
import ZhongjiPage from "./pages/ZhongjiPage";
import ZhiyongPage from "./pages/ZhiyongPage";
import XianqingPage from "./pages/XianqingPage";
import ContactPage from "./pages/ContactPage";
import CaseStudyBanling from "./pages/CaseStudyBanling";
import CaseStudyHermes from "./pages/CaseStudyHermes";
import DataAchievements from "./pages/DataAchievements";
import "./index.css";

/** 路由切换时回到页面顶部，避免新页面继承上一页的滚动位置 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 初始化埋点页面追踪
initPageTracking();

// 渲染应用根节点
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <UserAuthProvider>
      <StandaloneProvider>
      <Routes>
        {/* 首页：原作品集 + 小鹿书局三书陈列 */}
        <Route path="/" element={<App />} />
        {/* 筑基书页（卷一-卷六） */}
        <Route path="/zhongji/" element={<ZhongjiPage />} />
        {/* 致用书页（工具箱+非遗双栏） */}
        <Route path="/zhiyong/" element={<ZhiyongPage />} />
        {/* 闲情书页（卷七胶片流） */}
        <Route path="/xianqing/" element={<XianqingPage />} />
        {/* 小鹿书局独立页面（备用） */}
        <Route path="/bookstore" element={<BookstoreIndex />} />
        {/* ============ 旧路由保留 ============ */}
        {/* 森林疗愈室 */}
        <Route path="/forest" element={<App />} />
        {/* 疗愈室独立页面 */}
        <Route path="/healing" element={<HealingRoomPage />} />
        {/* 米奇妙妙屋：Launchpad 发射台 */}
        <Route path="/mickey" element={<MickeyLaunchpad />} />
        {/* 联系我 */}
        <Route path="/contact" element={<ContactPage />} />

        {/* /film route removed - LifeFilm module deleted */}
        <Route path="/music" element={<MusicPage />} />
        {/* 作品集首页：9 维度作品 3×3 网格 */}
        <Route path="/toolbox" element={<ToolboxHome />} />
        {/* 物资管家：库存管理应用（静态路径优先于 :title） */}
        <Route path="/toolbox/inventory" element={<InventoryPage />} />
        {/* /toolbox/supplies 别名：米奇妙妙屋中「物资管家」入口专用，指向同一组件 */}
        <Route path="/toolbox/supplies" element={<InventoryPage />} />
        {/* AdvicePage removed - module deleted */}
        {/* 通关清单：游戏化 To-Do */}
        <Route path="/toolbox/quests" element={<QuestLogPage />} />
        {/* /toolbox/memories route removed - Museum module deleted */}
        {/* 解压馆：交互式解压游戏集合 */}
        <Route path="/toolbox/games" element={<StressReliefPage />} />
        {/* 徽章墙：各游戏徽章收集展示 */}
        <Route path="/toolbox/games/badges/:game" element={<BadgeWallPage />} />
        {/* 回血清单：i人低能耗回血工具 */}
        <Route path="/toolbox/recharge" element={<RechargePage />} />
        {/* 漫游指南：旅行足迹与攻略（三模块嵌套路由） */}
        <Route path="/toolbox/travel" element={
          <ErrorBoundary>
            <RoamingGuideProvider>
              <RoamingGuideLayout />
            </RoamingGuideProvider>
          </ErrorBoundary>
        }>
          <Route index element={<Navigate to="map" replace />} />
          <Route path="map" element={<MapPage />} />
          <Route path="cities" element={<CitiesPage />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        <Route path="/toolbox/roaming-guide" element={
          <ErrorBoundary>
            <RoamingGuideProvider>
              <RoamingGuideLayout />
            </RoamingGuideProvider>
          </ErrorBoundary>
        }>
          <Route index element={<Navigate to="map" replace />} />
          <Route path="map" element={<MapPage />} />
          <Route path="cities" element={<CitiesPage />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        {/* 系统调频：5% 微改变认知工具 */}
        <Route path="/toolbox/answer" element={<SystemTuningPage />} />
        {/* 伴龄：AI 养老规划伴侣 */}
        <Route path="/toolbox/banling" element={<BanlingPage />} />
        {/* 作品详情占位页 */}
        <Route path="/toolbox/:title" element={<ToolboxDetail />} />
        {/* 产品案例研究（商业价值展示） */}
        <Route path="/case-study/banling" element={<CaseStudyBanling />} />
        <Route path="/case-study/hermes" element={<CaseStudyHermes />} />
        {/* 数据成果展示（公开指标看板） */}
        <Route path="/stats" element={<DataAchievements />} />
      </Routes>
      </StandaloneProvider>
      </UserAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
