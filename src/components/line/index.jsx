import { format } from "date-fns";
import { useEffect, useState } from "react";
import Informations from "../Informations";
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function Line({ clean }) {
  const [allEvidence, setAllEvidence] = useState(0)
  const [showModal, setShowModal] = useState(false);


  const startDate = format(new Date(clean.createdAt), 'dd/MM/yyyy HH:mm');
  const finishDate = format(new Date(clean.updatedAt), 'dd/MM/yyyy HH:mm');
  function countEvidences() {
    let countEvidence = []
    let valuesToPush = [clean.entrance, clean.exit, clean.obs1, clean.obs2, clean.obs3].filter(value => value !== null && value !== undefined);
    countEvidence.push(...valuesToPush);
    setAllEvidence(clean.evidences.length);
  }
  useEffect(() => {

    countEvidences()
  }, [])

  async function handleToggleModal() {
    setShowModal(!showModal);

  };
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  return (
    <tr>
      {showModal && <Informations onClose={handleToggleModal} showModal={showModal} datas={clean} />}
      <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">

          {startDate}
        </div>
      </td>
      <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">

          {clean.Place.name}
        </div>
      </td>
      {clean.status === "Pendente" ? (
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 md:table-cell hidden text-orange-500">{clean.status}</td>

      ) : (
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 md:table-cell hidden text-green-500" >{clean.status}</td>

      )}
      <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 text-green-500"> {allEvidence}</td>
      <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="sm:flex hidden flex-col">
            {finishDate}
          </div>

          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex items-center justify-center text-gray-400 ml-auto">
                <svg viewBox="0 0 24 24" className="w-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        
                        onClick={() => handleToggleModal()}
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm cursor-pointer hover:text-green-700'
                        )}
                      >
                        Relatório Completo
                      </span>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </td>
    </tr>
  )
}