import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useMemo } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';

type Props = {
  items: any[];
  renderItem?: (item: any) => string;
  onChange?: (value: string) => void;
  selected?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  menuClassName?: string;
};

export const Dropdown: React.FC<Props> = ({
  items,
  onChange,
  selected,
  placeholder,
  className,
  disabled = false,
  menuClassName,
  renderItem,
}) => {
  const display = useMemo(() => {
    if (selected) {
      return renderItem ? renderItem(selected) : selected;
    }
    return placeholder || 'Select...';
  }, [selected, renderItem, placeholder]);

  return (
    <Menu as="div" className="relative w-full text-left">
      <div>
        <Menu.Button
          disabled={disabled}
          className={twMerge(
            className,
            'inline-flex w-full items-center justify-between rounded-sm border border-gray-300 bg-white py-2 px-4 font-light text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-100',
            disabled ? 'bg-neutral-100' : ''
          )}
        >
          {display}
          <FiChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={twMerge(
            menuClassName,
            'absolute right-0 z-10 mt-2 w-full origin-top-right rounded-sm bg-white shadow-lg ring-1 ring-black/5 focus:outline-none'
          )}
        >
          <div className="py-2">
            {typeof items[0] === 'string'
              ? items.map((item) => (
                  <Menu.Item key={item}>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() => {
                          if (!onChange) return;
                          onChange(item);
                        }}
                        className={twMerge(
                          selected === item && 'font-normal text-gray-900',
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'flex flex-row justify-between px-4 py-2 text-base font-light '
                        )}
                      >
                        {item}
                        {selected === item && (
                          <FiCheck className="text-xl text-primary" />
                        )}
                      </a>
                    )}
                  </Menu.Item>
                ))
              : items.map((item, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() => {
                          if (!onChange) return;
                          onChange(item);
                        }}
                        className={twMerge(
                          selected === item.value &&
                            'font-normal text-gray-900',
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'flex flex-row justify-between px-4 py-2 text-base font-light '
                        )}
                      >
                        {renderItem ? renderItem(item) : item.name}
                        {selected === item.value && (
                          <FiCheck className="text-xl text-primary" />
                        )}
                      </a>
                    )}
                  </Menu.Item>
                ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
