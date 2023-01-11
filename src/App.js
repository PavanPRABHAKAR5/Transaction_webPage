import "./App.css";
import Balance from "./components/Balance";
import TableData from "./components/TableData";

function App() {
  return (
    <>
      <div className="heading">
        <h1 className="heading_1">Hello,WeFinance</h1>
        <h3 className="heading_2">Welcome to the world of digital escrow</h3>
      </div>
      <Balance />
      <TableData />
    </>
  );
}

export default App;
