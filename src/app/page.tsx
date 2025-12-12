"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Server,
  Database,
  RefreshCw,
  Box,
  Wifi,
  Zap,
  Search,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

interface Pod {
  address: string;
  version: string;
  last_seen: string;
  last_seen_timestamp: number;
}

export default function Home() {
  const [rpcUrl, setRpcUrl] = useState("http://34.127.11.12:6000/rpc");
  const [pods, setPods] = useState<Pod[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncId, setSyncId] = useState<string>("----");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const fetchPods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: rpcUrl,
          jsonrpc: "2.0",
          method: "get-pods",
          id: 1,
          params: [],
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      if (data.result && data.result.pods) {
        setPods(data.result.pods);
        setTotalCount(data.result.total_count);
      } else {
        throw new Error("Invalid structure");
      }
    } catch (err) {
      console.warn("Using Fallback Data");
      setError("Demo Network Simulation Active");
      setPods([
        {
          address: "192.168.1.100:9001",
          version: "1.0.0",
          last_seen: "2023-12-01 14:30:00 UTC",
          last_seen_timestamp: 1672574200,
        },
        {
          address: "10.0.0.5:9001",
          version: "1.0.1",
          last_seen: "2023-12-01 14:25:00 UTC",
          last_seen_timestamp: 1672573900,
        },
        {
          address: "45.33.22.11:9001",
          version: "1.15.0",
          last_seen: "Just now",
          last_seen_timestamp: 1672574500,
        },
        {
          address: "88.12.99.43:9001",
          version: "1.14.0",
          last_seen: "1 min ago",
          last_seen_timestamp: 1672574100,
        },
        {
          address: "23.44.12.90:9001",
          version: "1.15.0",
          last_seen: "5 mins ago",
          last_seen_timestamp: 1672574000,
        },
      ]);
      setTotalCount(5);
    } finally {
      setLoading(false);
    }
  }, [rpcUrl]);

  useEffect(() => {
    setMounted(true);
    setSyncId(Math.floor(Math.random() * 9999).toString());
    fetchPods();
  }, [fetchPods]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white selection:bg-cyan-500/30 font-sans overflow-hidden relative transition-colors duration-500">
      <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
        <div className="absolute inset-0 bg-grid-white mask-[linear-gradient(to_bottom,transparent,black)] opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none dark:hidden bg-linear-to-br from-gray-50 to-gray-200"></div>

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/50 backdrop-blur-xl"
      >
        <div className="container flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 hidden dark:block"></div>
              <div className="relative bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-2 rounded-xl shadow-sm dark:shadow-none">
                <Activity className="h-6 w-6 text-blue-600 dark:text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-2xl tracking-tighter text-gray-900 dark:text-white">
              Xandeum
              <span className="text-blue-600 dark:text-cyan-400">Scan</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-4 py-1.5 rounded-full border border-green-200 dark:border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              MAINNET LIVE
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-cyan-400" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container max-w-7xl mx-auto p-6 md:p-12 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600">
                Network Intelligence
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Advanced visualization for the Xandeum storage layer. Monitor
              pNodes, capacity, and network health in real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
          >
            <div className="relative w-full md:w-72 group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500 hidden dark:block"></div>
              <div className="relative flex items-center bg-white dark:bg-black rounded-lg border border-gray-300 dark:border-none">
                <Search className="absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  value={rpcUrl}
                  onChange={(e) => setRpcUrl(e.target.value)}
                  placeholder="RPC Endpoint"
                  className="pl-10 bg-transparent border-none text-gray-900 dark:text-white focus-visible:ring-0 h-12"
                />
              </div>
            </div>
            <Button
              onClick={fetchPods}
              disabled={loading}
              className="h-12 px-8 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-cyan-50 text-base font-bold shadow-lg transition-all duration-300"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "SYNCING..." : "REFRESH"}
            </Button>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-200 p-4 rounded-xl flex items-center gap-4 backdrop-blur-md"
          >
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg">
              <Wifi className="h-5 w-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <p className="font-bold">Connection Alert</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Active Nodes",
              value: totalCount,
              icon: Globe,
              sub: "Global Gossip Network",
              color: "text-blue-600 dark:text-cyan-400",
              bg: "dark:from-cyan-500/10",
            },
            {
              title: "Network State",
              value: "OPTIMAL",
              icon: Zap,
              sub: "Latency: <20ms",
              color: "text-yellow-600 dark:text-yellow-400",
              bg: "dark:from-yellow-500/10",
            },
            {
              title: "Storage Layer",
              value: "12.4 PB",
              icon: Database,
              sub: "Immutable Data",
              color: "text-purple-600 dark:text-purple-400",
              bg: "dark:from-purple-500/10",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div
                className={`hidden dark:block absolute -inset-0.5 bg-linear-to-br ${stat.bg} to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500`}
              />

              <div className="relative h-full bg-white dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-300 dark:hover:border-white/20 transition-all shadow-xl dark:shadow-none">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gray-100 dark:bg-white/5 ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Activity className="h-4 w-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                    {stat.title}
                  </h3>
                  <div className="text-4xl font-black mt-2 text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    {stat.sub}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-md overflow-hidden shadow-2xl dark:shadow-none"
        >
          <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/2">
            <div className="flex items-center gap-3">
              <Box className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Live Pods
              </h2>
            </div>
            <div className="text-xs font-mono text-gray-500">
              SYNC_ID:{" "}
              <span className="text-blue-600 dark:text-cyan-400">
                #{syncId}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-black/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-[0.2em] font-bold">
                <tr>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Node Identity</th>
                  <th className="px-6 py-5">Version</th>
                  <th className="px-6 py-5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-700 dark:text-gray-300">
                {pods.map((pod, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                        <span className="text-green-600 dark:text-green-400 font-mono text-xs">
                          OPERATIONAL
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-white transition-all duration-300">
                      {pod.address}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-xs font-mono text-gray-700 dark:text-cyan-300">
                        v{pod.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 font-mono text-xs">
                      {pod.last_seen}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="text-center pb-8 opacity-40 text-gray-500 dark:text-gray-400">
          <p className="text-[10px] tracking-[0.3em] uppercase">
            Secured by Solana • Powered by Xandeum
          </p>
        </div>
      </div>
    </div>
  );
}
