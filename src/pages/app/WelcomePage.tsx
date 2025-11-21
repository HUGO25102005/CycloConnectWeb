import { PageContainer } from "@ant-design/pro-components";
import { WelcomePerson } from "../../components/welcome";

const WelcomePage = () => {
  return (
    <PageContainer title={false}>
      <WelcomePerson />
    </PageContainer>
  );
};

export default WelcomePage;