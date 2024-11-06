import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "@/_auth/AuthLayout.tsx";
import SignIn from "@/_root/pages/SignIn.tsx";
import RootLayout from "@/_root/RootLayout.tsx";
import Dashboard from "@/_root/pages/Dashboard/Dashboard.tsx";
import Corridor from "@/_root/pages/Corridor.tsx";
import RoadSurvey from "@/_root/pages/RoadSurvey.tsx";
import Periodic from "@/_root/pages/Periodic.tsx";
import Statistic from "@/_root/pages/Statistic.tsx";
import Download from "@/_root/pages/Download.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import Cookies from "js-cookie";
import UpdateProfile from "@/_root/pages/UpdateProfile.tsx";
import EditRoadSection from "@/_root/pages/RoadSection/EditRoadSection.tsx";
import AddRoadSection from "@/_root/pages/RoadSection/AddRoadSection.tsx";
import RoadSection from "@/_root/pages/RoadSection";
import LandingPage from "@/_root/pages/LandingPage.tsx";
import AddBridgeSection from "@/_root/pages/BridgeSection/AddBridgeSection.tsx";
import EditBridgeSurvey from "@/_root/pages/BridgeSection/EditBridgeSurvey.tsx";
import BridgeSection from "@/_root/pages/BridgeSection";
import CreatePageTypeOfPavement from "@/components/Survey/RuasJalan/CreatePageTypeOfPavement.tsx";
import UpdatePageTypeOfPavement from "@/components/Survey/RuasJalan/UpdatePageTypeOfPavement.tsx";
import Drainase from "@/_root/pages/Drainase";
import AddDrainase from "@/_root/pages/Drainase/AddDrainase.tsx";
import EditDrainase from "@/_root/pages/Drainase/EditDrainase.tsx";
import CreatePageSurveyDrainase from "@/components/Survey/Drainase/CreatePageSurveyDrainase.tsx";
import UpdatePageSurveyDrainase from "@/components/Survey/Drainase/UpdatePageSurveyDrainase.tsx";
import DrainaseSurvey from "@/_root/pages/DrainaseSurvey.tsx";
import DrainaseDetail from "@/components/Survey/Drainase/DrainaseDetail.tsx";
import ImagePageSurveyDrainase from "@/components/Survey/Drainase/ImagePageSurveyDrainase.tsx";
import BridgeSurveyVerification from "./_root/pages/VerifBridgeSection";
import DrainaseVerification from "./_root/pages/VerifDrainase";
import RoadSectionVerification from "./_root/pages/VerifRoad";
import DrainaseDetailVerif from "./components/Verifikasi/Drainase/DrainaseDetailVerif";

function App() {
  const token = Cookies.get("adsxcl");
  const isLoggedIn = !!token;

  return (
    <main className="flex h-screen font-poppins">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/sign-in"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignIn />
            }
          />
        </Route>
        <Route index element={<LandingPage />} />
        <Route element={<RootLayout />}>
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/corridor"
            element={
              isLoggedIn ? <Corridor /> : <Navigate to="/sign-in" replace />
            }
          />
          {/* verifikasi */}
          <Route
            path="/verification-bridge"
            element={
              isLoggedIn ? (
                <BridgeSurveyVerification />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/verification-drainase"
            element={
              isLoggedIn ? (
                <DrainaseVerification />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/verification-drainase/detail/:id"
            element={
              isLoggedIn ? (
                <DrainaseDetailVerif />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/verification-road"
            element={
              isLoggedIn ? (
                <RoadSectionVerification />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          {/* verifikasi */}
          <Route
            path="/bridge-survey"
            element={
              isLoggedIn ? (
                <BridgeSection />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/bridge-survey/create"
            element={
              isLoggedIn ? (
                <AddBridgeSection />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/bridge-survey/edit/:id"
            element={
              isLoggedIn ? (
                <EditBridgeSurvey />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          {/* survey */}
          <Route
            path="/drainase"
            element={
              isLoggedIn ? <Drainase /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/drainase/create"
            element={
              isLoggedIn ? <AddDrainase /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/drainase/edit/:id"
            element={
              isLoggedIn ? <EditDrainase /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/road-section"
            element={
              isLoggedIn ? <RoadSection /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/road-section/create"
            element={
              isLoggedIn ? (
                <AddRoadSection />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/road-section/edit/:id"
            element={
              isLoggedIn ? (
                <EditRoadSection />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/road-survey"
            element={
              isLoggedIn ? <RoadSurvey /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/road-survey/create"
            element={
              isLoggedIn ? (
                <CreatePageTypeOfPavement />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/road-survey/edit/:id"
            element={
              isLoggedIn ? (
                <UpdatePageTypeOfPavement />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/survey-drainase"
            element={
              isLoggedIn ? (
                <DrainaseSurvey />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/survey-drainase/create"
            element={
              isLoggedIn ? (
                <CreatePageSurveyDrainase />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/survey-drainase/image"
            element={
              isLoggedIn ? (
                <ImagePageSurveyDrainase />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/survey-drainase/edit/:id"
            element={
              isLoggedIn ? (
                <UpdatePageSurveyDrainase />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/survey-drainase/detail/:id"
            element={
              isLoggedIn ? (
                <DrainaseDetail />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          {/* survey */}
          <Route
            path="/periodic"
            element={
              isLoggedIn ? <Periodic /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/statistic"
            element={
              isLoggedIn ? <Statistic /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/download"
            element={
              isLoggedIn ? <Download /> : <Navigate to="/sign-in" replace />
            }
          />
          <Route
            path="/update-profile"
            element={
              isLoggedIn ? (
                <UpdateProfile />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
