import logo from "./logo.svg";
// import "./App.css";
import OrderForm from "./pages/OrderForm";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <OrderForm />
      </div>
      <Footer />
    </div>
  );
}

export default App;
