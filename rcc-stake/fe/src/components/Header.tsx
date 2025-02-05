"use client";
import { Box, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Stake",
      path: "/stake",
    },
    {
      name: "Withdrawal",
      path: "/withdrawal",
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: "10px 40px",
        borderBottom: "1px solid #888",
      }}
    >
      <Box sx={{fontWeight: 'bold'}}>RCC stake</Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {links.map((link, index) => {
            const active =
              pathname === link.path || pathname === link.path + "/";
            return (
              <Typography
                sx={{
                  mx: "15px",
                  fontWeight: active ? "800" : "300",
                  fontSize: "18px",
                  textTransform: "none",
                  "&:before": {
                    content: '""',
                    display: active ? "inline-block" : "none",
                    verticalAlign: "middle",
                    mr: "3px",
                    width: "5px",
                    height: "5px",
                    borderRadius: "10px",
                    background: "#000",
                    fontSize: "20px",
                  },
                }}
                key={index}
              >
                <Link
                  style={{
                    cursor: link.path === "#" ? "not-allowed" : "pointer",
                  }}
                  href={link.path}
                >
                  {link.name}
                </Link>
              </Typography>
            );
          })}
        </Box>
        <ConnectButton></ConnectButton>
      </Box>
    </Box>
  );
};

export default Header;
