import OrderPage from "./pages/OrderPage";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <OrderPage />
      </div>
      <Footer />
    </div>
  );
}

export default App;
