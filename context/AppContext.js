"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  initialCurrentUser,
  initialRoommates,
  initialGroups,
  initialExpenses,
  initialRoommateDebts,
  initialSettlementTransactions,
} from "@/data/mockData";
import { formatINR } from "@/lib/expenseSplitter";

const AppContext = createContext(null);
const STORAGE_KEY = "hostelpay_state_v2";

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [roommates, setRoommates] = useState(initialRoommates);
  const [groups, setGroups] = useState(initialGroups);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [roommateDebts, setRoommateDebts] = useState(initialRoommateDebts);
  const [settlements, setSettlements] = useState(initialSettlementTransactions);
  const [selectedGroupId, setSelectedGroupId] = useState("group-1");
  const [aiSparkleEnabled, setAiSparkleEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "info" });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      // Clear legacy storage key if exists
      localStorage.removeItem("hostelpay_state_v1");

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure legacy user names do not persist
        if (parsed.currentUser && parsed.currentUser.name?.includes("Rahul")) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          if (parsed.currentUser) setCurrentUser(parsed.currentUser);
          if (parsed.roommates) setRoommates(parsed.roommates);
          if (parsed.groups) setGroups(parsed.groups);
          if (parsed.expenses) setExpenses(parsed.expenses);
          if (parsed.roommateDebts) setRoommateDebts(parsed.roommateDebts);
          if (parsed.settlements) setSettlements(parsed.settlements);
          if (parsed.selectedGroupId) setSelectedGroupId(parsed.selectedGroupId);
          if (typeof parsed.aiSparkleEnabled === "boolean") setAiSparkleEnabled(parsed.aiSparkleEnabled);
        }
      }
    } catch (e) {
      console.warn("Failed to read from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const dataToSave = {
        currentUser,
        roommates,
        groups,
        expenses,
        roommateDebts,
        settlements,
        selectedGroupId,
        aiSparkleEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }
  }, [
    isLoaded,
    currentUser,
    roommates,
    groups,
    expenses,
    roommateDebts,
    settlements,
    selectedGroupId,
    aiSparkleEnabled,
  ]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Reset to initial demo data
  const resetDemoData = () => {
    setCurrentUser(initialCurrentUser);
    setRoommates(initialRoommates);
    setGroups(initialGroups);
    setExpenses(initialExpenses);
    setRoommateDebts(initialRoommateDebts);
    setSettlements(initialSettlementTransactions);
    setSelectedGroupId("group-1");
    setAiSparkleEnabled(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    showToast("Demo data reset to fresh hostel state!", "info");
  };

  // Add new expense
  const addExpense = (newExpense) => {
    const id = `exp-${Date.now()}`;
    const expenseWithId = {
      ...newExpense,
      id,
      date: newExpense.date || "Today",
    };

    setExpenses((prev) => [expenseWithId, ...prev]);

    // Update group total spend
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id === newExpense.groupId) {
          const newTotal = g.totalSpend + Number(newExpense.amount);
          const yourShare = Math.round(newTotal / (g.membersCount || 4));
          return {
            ...g,
            totalSpend: newTotal,
            yourShare,
          };
        }
        return g;
      })
    );

    // If Sujit paid, other members now owe their share to Sujit
    if (newExpense.paidBy === "user-1") {
      const perPerson = Number(newExpense.amount) / (newExpense.splits?.length || 4);
      setRoommateDebts((prevDebts) =>
        prevDebts.map((debt) => {
          const isParticipant = newExpense.splits?.some((s) => s.userId === debt.userId);
          if (isParticipant) {
            const added = Math.round(perPerson);
            if (debt.type === "owed_to_you") {
              const newAmt = debt.amount + added;
              return {
                ...debt,
                amount: newAmt,
                statusText: `Owes you ${formatINR(newAmt)}`,
              };
            } else if (debt.type === "you_owe") {
              const diff = debt.amount - added;
              if (diff <= 0) {
                return {
                  ...debt,
                  type: "owed_to_you",
                  amount: Math.abs(diff),
                  statusText: `Owes you ${formatINR(Math.abs(diff))}`,
                };
              }
              return {
                ...debt,
                amount: diff,
                statusText: `You owe ${formatINR(diff)}`,
              };
            } else {
              // was settled
              return {
                ...debt,
                type: "owed_to_you",
                amount: added,
                statusText: `Owes you ${formatINR(added)}`,
              };
            }
          }
          return debt;
        })
      );
    } else {
      // Someone else paid, Sujit owes his share to that person
      const sujitShare = newExpense.splits?.find((s) => s.userId === "user-1")?.amount || 0;
      if (sujitShare > 0) {
        setRoommateDebts((prevDebts) =>
          prevDebts.map((debt) => {
            if (debt.userId === newExpense.paidBy) {
              const added = Math.round(sujitShare);
              if (debt.type === "you_owe") {
                const newAmt = debt.amount + added;
                return {
                  ...debt,
                  amount: newAmt,
                  statusText: `You owe ${formatINR(newAmt)}`,
                };
              } else if (debt.type === "owed_to_you") {
                const diff = debt.amount - added;
                if (diff < 0) {
                  return {
                    ...debt,
                    type: "you_owe",
                    amount: Math.abs(diff),
                    statusText: `You owe ${formatINR(Math.abs(diff))}`,
                  };
                }
                return {
                  ...debt,
                  amount: diff,
                  statusText: `Owes you ${formatINR(diff)}`,
                };
              } else {
                return {
                  ...debt,
                  type: "you_owe",
                  amount: added,
                  statusText: `You owe ${formatINR(added)}`,
                };
              }
            }
            return debt;
          })
        );
      }
    }

    showToast(`Expense "${newExpense.title}" of ${formatINR(newExpense.amount)} added!`, "success");
  };

  // Record simulated payment settlement
  const recordSettlement = ({ userId, amount, method, note }) => {
    const roommate = roommates.find((r) => r.id === userId) || { name: "Roommate", shortName: "Roommate" };
    const numAmount = Number(amount);

    // Update debts
    setRoommateDebts((prevDebts) =>
      prevDebts.map((debt) => {
        if (debt.userId === userId) {
          const remaining = Math.max(0, debt.amount - numAmount);
          if (remaining === 0) {
            return {
              ...debt,
              amount: 0,
              type: "settled",
              statusText: "Settled",
            };
          }
          return {
            ...debt,
            amount: remaining,
            statusText:
              debt.type === "owed_to_you"
                ? `Owes you ${formatINR(remaining)}`
                : `You owe ${formatINR(remaining)}`,
          };
        }
        return debt;
      })
    );

    // Add to settlement ledger
    const newSettlement = {
      id: `settle-${Date.now()}`,
      type: "paid",
      person: roommate.shortName,
      date: "Today",
      amount: numAmount,
      status: "Completed",
      method: method || "UPI (Simulated)",
    };

    setSettlements((prev) => [newSettlement, ...prev]);
    showToast(`Simulated Payment of ${formatINR(numAmount)} to ${roommate.name} recorded!`, "success");
  };

  // Record received payment (request cleared)
  const recordReceivedPayment = ({ userId, amount, method }) => {
    const roommate = roommates.find((r) => r.id === userId) || { name: "Roommate", shortName: "Roommate" };
    const numAmount = Number(amount);

    setRoommateDebts((prevDebts) =>
      prevDebts.map((debt) => {
        if (debt.userId === userId) {
          const remaining = Math.max(0, debt.amount - numAmount);
          return {
            ...debt,
            amount: remaining,
            type: remaining === 0 ? "settled" : "owed_to_you",
            statusText: remaining === 0 ? "Settled" : `Owes you ${formatINR(remaining)}`,
          };
        }
        return debt;
      })
    );

    const newSettlement = {
      id: `settle-${Date.now()}`,
      type: "received",
      person: roommate.shortName,
      date: "Today",
      amount: numAmount,
      status: "Completed",
      method: method || "UPI Received (Simulated)",
    };

    setSettlements((prev) => [newSettlement, ...prev]);
    showToast(`Received ${formatINR(numAmount)} from ${roommate.name} marked as completed!`, "success");
  };

  // Send payment reminder request
  const requestPaymentReminder = (userId) => {
    const roommate = roommates.find((r) => r.id === userId);
    showToast(`Payment request reminder sent to ${roommate?.name || "Roommate"} via WhatsApp & SMS!`, "info");
  };

  // Create new group
  const createGroup = (groupData) => {
    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupData.name,
      shortName: groupData.name,
      category: groupData.category || "Hostel Rooms",
      membersCount: (groupData.memberIds?.length || 1) + 1,
      memberIds: ["user-1", ...(groupData.memberIds || [])],
      totalSpend: 0,
      yourShare: 0,
      balanceStatus: "Settled",
      balanceType: "settled",
      balanceAmount: 0,
      active: false,
    };

    setGroups((prev) => [newGroup, ...prev]);
    setSelectedGroupId(newGroup.id);
    showToast(`Group "${newGroup.name}" created successfully!`, "success");
  };

  // Join group via code
  const joinGroupByCode = (code) => {
    const existing = groups.find((g) => g.id.toLowerCase().includes(code.toLowerCase()));
    if (existing) {
      setSelectedGroupId(existing.id);
      showToast(`Joined ${existing.name}!`, "success");
      return true;
    }
    const joined = {
      id: `group-${Date.now()}`,
      name: `Joined Group (${code.toUpperCase()})`,
      shortName: code.toUpperCase(),
      category: "Hostel Rooms",
      membersCount: 4,
      memberIds: ["user-1", "user-2", "user-3"],
      totalSpend: 4200,
      yourShare: 1050,
      balanceStatus: "Settled",
      balanceType: "settled",
      balanceAmount: 0,
      active: false,
    };
    setGroups((prev) => [joined, ...prev]);
    setSelectedGroupId(joined.id);
    showToast(`Joined group with code ${code.toUpperCase()}!`, "success");
    return true;
  };

  // Invite roommate
  const inviteMember = (groupId, emailOrPhone) => {
    showToast(`Invite link sent to ${emailOrPhone}!`, "success");
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
    showToast("Profile settings saved successfully!", "success");
  };

  // Derived calculations
  const totalYouOwe = useMemo(() => {
    return roommateDebts
      .filter((d) => d.type === "you_owe")
      .reduce((sum, d) => sum + d.amount, 0);
  }, [roommateDebts]);

  const totalYouAreOwed = useMemo(() => {
    return roommateDebts
      .filter((d) => d.type === "owed_to_you")
      .reduce((sum, d) => sum + d.amount, 0);
  }, [roommateDebts]);

  const totalGroupExpenses = useMemo(() => {
    const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
    return activeGroup ? activeGroup.totalSpend : 5830;
  }, [groups, selectedGroupId]);

  const totalCompletedSettlements = useMemo(() => {
    return settlements
      .filter((s) => s.status === "Completed")
      .reduce((sum, s) => sum + s.amount, 0);
  }, [settlements]);

  const selectedGroup = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId) || groups[0];
  }, [groups, selectedGroupId]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        roommates,
        groups,
        expenses,
        roommateDebts,
        settlements,
        selectedGroupId,
        setSelectedGroupId,
        selectedGroup,
        aiSparkleEnabled,
        setAiSparkleEnabled,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        hideToast,
        resetDemoData,
        addExpense,
        recordSettlement,
        recordReceivedPayment,
        requestPaymentReminder,
        createGroup,
        joinGroupByCode,
        inviteMember,
        updateProfile,
        totalYouOwe,
        totalYouAreOwed,
        totalGroupExpenses,
        totalCompletedSettlements,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
