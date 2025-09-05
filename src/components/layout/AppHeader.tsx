// Application Header Component

import React from 'react';
import { Bell, Search, User, LogOut, Moon, Sun, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector, useAppDispatch } from '@/store';
import { setTheme, setLanguage, setCurrentCountry } from '@/store/slices/uiSlice';
import { countryInfo } from '@/data/mockData';

export const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, language, currentCountry } = useAppSelector(state => state.ui);
  const analytics = useAppSelector(state => state.analytics.data);

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageToggle = () => {
    dispatch(setLanguage(language === 'en' ? 'ar' : 'en'));
  };

  const handleCountryChange = (countryCode: keyof typeof countryInfo) => {
    dispatch(setCurrentCountry(countryCode));
  };

  return (
    <header className="h-16 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients, claims, or procedures..."
              className="pl-10 bg-background/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Active Claims Badge */}
          {analytics && (
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-light/20 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-primary">
                {analytics.activeClaims} Active Claims
              </span>
            </div>
          )}

          {/* Country Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe2 className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {countryInfo[currentCountry].flag} {countryInfo[currentCountry].name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur">
              <DropdownMenuLabel>Select Country</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(countryInfo).map(([code, info]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => handleCountryChange(code as keyof typeof countryInfo)}
                  className={currentCountry === code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{info.flag}</span>
                  {info.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover/95 backdrop-blur">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex-col items-start p-4 space-y-1">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="font-medium text-sm">Claim Review Required</span>
                    <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    High-value claim CLM-4567 requires manual review
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-4 space-y-1">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="font-medium text-sm">Pre-Auth Approved</span>
                    <span className="text-xs text-muted-foreground ml-auto">15m ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pre-authorization PRE-8901 has been automatically approved
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start p-4 space-y-1">
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-2 h-2 rounded-full bg-error" />
                    <span className="font-medium text-sm">Payment Delayed</span>
                    <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payment for claim CLM-3456 has been delayed by insurance provider
                  </p>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            className="w-8 h-8 p-0"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <Avatar className="w-7 h-7">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-sm font-medium">Dr. John Doe</span>
                  <span className="text-xs text-muted-foreground">Administrator</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLanguageToggle}>
                <Globe2 className="mr-2 h-4 w-4" />
                Language: {language === 'en' ? 'English' : 'العربية'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};