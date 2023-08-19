import { format } from "date-fns";
import { useEffect, useState } from "react";
import Informations from "../Informations";

export default function Line({clean,managerId,reload}){
    const [allEvidence,setAllEvidence] = useState(0)
    const [showModal, setShowModal] = useState(false);
    

    const startDate = format(new Date(clean.createAt), 'dd/MM/yyyy HH:mm');
    const finishDate = format(new Date(clean.updateAt), 'dd/MM/yyyy HH:mm');

    function countEvidences(){
      if(clean.entrance){
        setAllEvidence(allEvidence + 1)
      }
      if(clean.exit){
        setAllEvidence(allEvidence + 2)
      }
      if(clean.obs1){
        setAllEvidence(allEvidence + 3)
      }
      if(clean.obs2){
        setAllEvidence(allEvidence + 4)
      }
      if(clean.obs3){
        setAllEvidence(allEvidence + 5)
      }

    }
    useEffect(() =>{
      
      countEvidences()
    },[])

    async function handleToggleModal() {
      reload()
      setShowModal(!showModal);
      
    };
    return(
      <tr onClick={() => handleToggleModal()} className="cursor-pointer">
        {showModal && <Informations onClose={handleToggleModal}  showModal={showModal} datas={clean} managerId={managerId}/>}
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            
            {startDate}
          </div>
        </td>
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            
            {clean.where}
          </div>
        </td>
        {clean.status === "Pendente"?(
            <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 md:table-cell hidden text-orange-500">{clean.status}</td>

        ):(
            <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 md:table-cell hidden text-green-500" >{clean.status}</td>

        )}
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800 text-green-500"> {allEvidence}</td>
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="sm:flex hidden flex-col">
              {finishDate}
            </div>
            <button className="w-8 h-8 inline-flex items-center justify-center text-gray-400 ml-auto">
              <svg viewBox="0 0 24 24" className="w-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    )
}