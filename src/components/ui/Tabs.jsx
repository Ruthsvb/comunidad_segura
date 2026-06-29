import React, { useState } from 'react';

export function Tabs({ defaultValue, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (child.type === TabsList || child.type === TabsContent) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className, activeTab, setActiveTab }) {
  return (
    <div className={`flex gap-2 border-b border-gray-200 ${className || ''}`}>
      {React.Children.map(children, child => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, children, activeTab, setActiveTab, className }) {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
        isActive
          ? 'text-primary border-primary'
          : 'text-gray-600 border-transparent hover:text-gray-900'
      } ${className || ''}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, activeTab, className }) {
  if (activeTab !== value) return null;

  return (
    <div className={className}>
      {children}
    </div>
  );
}
