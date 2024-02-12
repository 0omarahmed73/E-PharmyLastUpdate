import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import DefaultLayout from "./Layout/DefaultLayout/DefaultLayout";
import AddAccount from "./Pages/AddAccount/AddAccount";
import Stock from "./Pages/Stock/Stock";
import Dispense from "./Pages/Stock/Dispense/Dispense";
import NewOrder from "./Pages/Stock/NewOrder/NewOrder";
import Medicine from "./Pages/Stock/Medicine/Medicine";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Page404 from "./Pages/Page404/Page404";
import AddMedicine from "./Pages/Stock/Medicine/AddMedicine/AddMedicine";
import AllMedicines from "./Pages/New Pages/AllMedicines/AllMedicines";
import MedicineInfo from "./Pages/New Pages/MedicineInfo/MedicineInfo";
import PatientsCategories from "./Pages/New Pages/Patients/PatientsCategories/PatientsCategories";
import PatientsList from "./Pages/New Pages/Patients/PatientsList/PatientsList";
import PatientInfo from "./Pages/New Pages/Patients/PatientInfo/PatientInfo";
import AddNewPatient from "./Pages/New Pages/Patients/AddNewPatient/AddNewPatient";
import DispenseChoose from "./Pages/Stock/Dispense/DispenseChoose/DispenseChoose";
import OldDispenses from "./Pages/Stock/Dispense/OldDispenses/OldDispenses";
import OrdersChoose from "./Pages/Stock/NewOrder/OrdersChoose/OrdersChoose";
import OldOrders from "./Pages/Stock/NewOrder/OldOrders/OldOrders";
import NotificationsPage from "./Pages/Notifications/Notifications";
import OrderInfo from "./Pages/Stock/NewOrder/OrderInfo/OrderInfo";
import DispenseInfo from "./Pages/Stock/Dispense/DispenseInfo/DispenseInfo";
import Inventory from "./Pages/Stock/Inventory/Inventory";
import Usage from "./Pages/Stock/Dispense/Usage/Usage";
import UsageInfo from "./Pages/Stock/Dispense/Usage/UsageInfo/UsageInfo";
import Sales from "./Pages/Stock/Sales/Sales";
import Collages from "./Pages/Stock/Collages/Collages";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/stock" />} />
      {/* Sidebar Routes */}
      <Route
        path="/"
        element={user ? <DefaultLayout /> : <Navigate to="/login" />}
      >
        <Route
          index
          element={user ? <Navigate to="/stock" /> : <Navigate to="/login" />}
        />
        <Route
          path="reports"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="add-new-account"
          element={user ? <AddAccount /> : <Navigate to="/login" />}
        />
        <Route
          path="notifications"
          element={user ? <NotificationsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={user ? <Page404 /> : <Navigate to="/login" />}
        />
      </Route>
      {/* Stock Routes */}
      <Route
        path="/stock"
        element={user ? <DefaultLayout /> : <Navigate to="/login" />}
      >
        <Route index element={user ? <Stock /> : <Navigate to="/login" />} />
        <Route
          path="medicine-dispense"
          element={user ? <DispenseChoose /> : <Navigate to="/login" />}
        />
        <Route
          path="new-order"
          element={user ? <NewOrder /> : <Navigate to="/login" />}
        />
        <Route
          path="inventory"
          element={user ? <Inventory /> : <Navigate to="/login" />}
        />
        <Route
          path="sales"
          element={user ? <Sales /> : <Navigate to="/login" />}
        />
        <Route
          path="collages"
          element={user ? <Collages /> : <Navigate to="/login" />}
        />
      </Route>
      {/* Dispenses Routes */}
      <Route
        path="/stock/medicine-dispense"
        element={user ? <DefaultLayout /> : <Navigate to="/login" />}
      >
        <Route
          index
          element={user ? <DispenseChoose /> : <Navigate to="/login" />}
        />
        <Route
          path="new-dispense"
          element={user ? <Dispense /> : <Navigate to="/login" />}
        />
        <Route
          path="old-dispenses/:type"
          element={user ? <OldDispenses /> : <Navigate to="/login" />}
        />
        <Route
          path="old-dispenses/:type/:id"
          element={user ? <DispenseInfo /> : <Navigate to="/login" />}
        />
        <Route
          path="edit/:id"
          element={user ? <Dispense /> : <Navigate to="/login" />}
        />
        <Route
          path="usage"
          element={user ? <Usage /> : <Navigate to="/login" />}
        />

        <Route
          path="usage/:id"
          element={user ? <UsageInfo /> : <Navigate to="/login" />}
        />
      </Route>
      {/* Orders Routes */}
      <Route
        path="/stock/orders"
        element={user ? <DefaultLayout /> : <Navigate to="/login" />}
      >
        <Route
          index
          element={user ? <OrdersChoose /> : <Navigate to="/login" />}
        />
        <Route
          path="new-order"
          element={user ? <NewOrder /> : <Navigate to="/login" />}
        />
        <Route
          path="old-orders"
          element={user ? <OldOrders /> : <Navigate to="/login" />}
        />
        <Route
          path="old-orders/:id"
          element={user ? <OrderInfo /> : <Navigate to="/login" />}
        />
        <Route
          path="edit/:id"
          element={user ? <NewOrder /> : <Navigate to="/login" />}
        />
      </Route>
      {/* Medicines Routes */}
      <Route
        path="/stock/medicines"
        element={user ? <DefaultLayout /> : <Navigate to="/login" />}
      >
        <Route index element={user ? <Medicine /> : <Navigate to="/login" />} />
        <Route
          path="add-medicine"
          element={user ? <AddMedicine /> : <Navigate to="/login" />}
        />
        <Route
          path="info/:id"
          element={user ? <MedicineInfo /> : <Navigate to="/login" />}
        />
        <Route
          path="edit/:id"
          element={user ? <AddMedicine /> : <Navigate to="/login" />}
        />
      <Route
        path="type/:type"
        element={user ? <AllMedicines /> : <Navigate to="/login" />}
      />
      </Route>
      {/* Patients Routes */}
      <Route
        path="/patients"
        element={user ? <DefaultLayout /> : <Navigate to="/login" />}
      >
        <Route
          index
          element={user ? <PatientsCategories /> : <Navigate to="/login" />}
        />
        <Route
          path=":type"
          element={user ? <PatientsList /> : <Navigate to="/login" />}
        />

        <Route
          path=":type/:id"
          element={user ? <PatientInfo /> : <Navigate to="/login" />}
        />
        <Route
          path="add-new-patient"
          element={user ? <AddNewPatient /> : <Navigate to="/login" />}
        />
        <Route
          path="edit/:id"
          element={user ? <AddNewPatient /> : <Navigate to="/login" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
