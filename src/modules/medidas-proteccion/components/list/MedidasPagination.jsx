import PropTypes from "prop-types";
import { Box, Pagination, Stack, Typography } from "@mui/material";

export default function MedidasPagination({
  page,
  pageCount,
  totalRecords,
  visibleRecords,
  startRecord,
  endRecord,
  onPageChange,
}) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "center" }}
      spacing={2}
      sx={{
        px: { xs: 0.5, md: 1 },
        py: 1,
      }}
    >
      <Typography
        sx={{
          fontFamily: "Noto Sans, sans-serif",
          color: "#475569",
          fontSize: "0.9rem",
          fontWeight: 850,
        }}
      >
        Mostrando{" "}
        <Box component="span" sx={{ color: "#8f1538", fontWeight: 950 }}>
          {visibleRecords > 0 ? startRecord : 0}
        </Box>{" "}
        a{" "}
        <Box component="span" sx={{ color: "#8f1538", fontWeight: 950 }}>
          {endRecord}
        </Box>{" "}
        de{" "}
        <Box component="span" sx={{ color: "#8f1538", fontWeight: 950 }}>
          {totalRecords}
        </Box>{" "}
        registros filtrados
      </Typography>

      <Pagination
        count={pageCount}
        page={page}
        onChange={onPageChange}
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "12px",
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 900,
            color: "#475569",
          },
          "& .Mui-selected": {
            backgroundColor: "#bc955c !important",
            color: "#ffffff",
          },
        }}
      />
    </Stack>
  );
}

MedidasPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
  visibleRecords: PropTypes.number.isRequired,
  startRecord: PropTypes.number.isRequired,
  endRecord: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};