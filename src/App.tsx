import { RouterProvider } from 'react-router';
import { router } from './app/routes';
import { AuthProvider } from './context/AuthContext';
import { CampaignProvider } from './context/CampaignContext';
import { StatsProvider } from './context/StatsContext';

export default function App() {
  return (
    <AuthProvider>
      <CampaignProvider>
        <StatsProvider>
          <RouterProvider router={router} />
        </StatsProvider>
      </CampaignProvider>
    </AuthProvider>
  );
}
