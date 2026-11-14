import { useNavigate } from "react-router-dom";
import HeaderTabs from "../../Komponente/HeaderTabs/HeaderTabs";
import OpportunityForm from "../../Komponente/Prilike/PrilikaForma";

export default function NovaPrilika() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderTabs />
      <OpportunityForm
        mode="create"
        onCancel={() => navigate("/moje-prilike")}
      />
    </>
  );
}
