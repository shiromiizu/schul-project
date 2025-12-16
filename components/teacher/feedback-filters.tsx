'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CategoryRecord } from '@/lib/types';

export function FeedbackFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'oldest';
  const hideAnswered = searchParams.get('hideAnswered') !== 'false'; // Default true

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (value: string) => {
    router.push(pathname + '?' + createQueryString('category', value));
  };

  const handleSortChange = (value: string) => {
    router.push(pathname + '?' + createQueryString('sort', value));
  };

  const handleHideAnsweredChange = (checked: boolean) => {
    router.push(pathname + '?' + createQueryString('hideAnswered', checked.toString()));
  };

  const getCategoryLabel = (val: string) => {
    if (val === 'all') return 'Alle Kategorien';
    const found = Object.values(CategoryRecord).find((c) => c.value === val);
    return found ? found.label : val;
  };

  const getSortLabel = (val: string) => {
    if (val === 'newest') return 'Neueste zuerst';
    if (val === 'oldest') return 'Älteste zuerst';
    return val;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-2 bg-card border rounded-lg shadow-sm items-center mb-6">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full sm:w-[200px] justify-start px-2 font-normal">
              <Filter className="h-4 w-4 text-muted-foreground mr-2" />
              {getCategoryLabel(category)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => handleCategoryChange('all')}>
              Alle Kategorien
            </DropdownMenuItem>
            {Object.values(CategoryRecord).map((cat) => (
              <DropdownMenuItem key={cat.value} onClick={() => handleCategoryChange(cat.value)}>
                {cat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden sm:block h-6 w-px bg-border" />

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full sm:w-[200px] justify-start px-2 font-normal">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2" />
              {getSortLabel(sort)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => handleSortChange('newest')}>
              Neueste zuerst
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('oldest')}>
              Älteste zuerst
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden sm:block h-6 w-px bg-border" />

      <div
        className="flex items-center space-x-2 px-3 py-2 w-full sm:w-auto hover:bg-accent/50 rounded-md cursor-pointer"
        onClick={() => handleHideAnsweredChange(!hideAnswered)}
      >
        <Checkbox
          id="hideAnswered"
          checked={hideAnswered}
          onCheckedChange={(checked) => handleHideAnsweredChange(checked as boolean)}
          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <Label htmlFor="hideAnswered" className="cursor-pointer flex items-center gap-2">
          <span>Beantwortete ausblenden</span>
        </Label>
      </div>
    </div>
  );
}
