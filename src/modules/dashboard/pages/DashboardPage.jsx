import { Button, Container, Typography } from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";

/**
 * Dashboard temporal.
 * @returns {JSX.Element}
 */
export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard DTI
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Bienvenido: {user?.nombre || user?.username || "Usuario"}
      </Typography>

      <Button variant="outlined" onClick={logout}>
        Cerrar sesión
      </Button>
    </Container>
  );
}