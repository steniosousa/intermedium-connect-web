import React, { useEffect, useRef, useState } from "react";
import Api from "../../api/service";
import Alert from "../alert";

let useClickOutside = (handler) => {
  let domNode = useRef();


  useEffect(() => {
    let maybeHandler = (event) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const Dropdown3 = ({ userId }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [choses, setChoses] = useState([])

  let domNode = useClickOutside(() => {
    setDropdownOpen(false);
  });
  const [datas, setDatas] = useState([])

  async function getDatas() {
    try {
      const { data } = await Api.get('/schedule/', { params:{userId: userId.id} })
      setDatas(data)
    setShowModal(false)

    }
    catch (error) {
      console.log(error)
    setShowModal(false)

    }

  }

  function handleDeletion(e){
    const filter = choses.find((item) => item == e.target.value)
    if(filter){
      const deletion = choses.filter((item) => item != e.target.value)
      setChoses(deletion) 
    }
    else{
      setChoses([...choses,e.target.value])
    }
    
  }
  
  useEffect(() => {
    getDatas()
  }, [userId])
  const dayOfWeek = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"]
  const [showModal, setShowModal] = useState(false)

  async function sendOfDeletion(){
    setShowModal(true)
    try{
      await Api.post('/schedule/edit',{params:choses})
      getDatas()
    }catch(error){
      setShowModal(false)
    }
    setChoses([])
  }

  function CloseAlert(){
    setShowModal(!showModal)
  }

  return (
    <div className='container'>
      <div className='flex flex-wrap '>
        <div ref={domNode} >
          {showModal && <Alert onCloseAlert={CloseAlert} showAlert={showModal}/>}
          <div className='text-center'>
            <div className='relative inline-block text-left'>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center rounded bg-transparent py-3 px-5 text-base font-semibold text-white`}
              >
                Agendas
                <span className='pl-2'>
                  <svg
                    width='12'
                    height='7'
                    viewBox='0 0 12 7'
                    className='fill-current'
                  >
                    <path d='M0.564864 0.879232C0.564864 0.808624 0.600168 0.720364 0.653125 0.667408C0.776689 0.543843 0.970861 0.543844 1.09443 0.649756L5.82517 5.09807C5.91343 5.18633 6.07229 5.18633 6.17821 5.09807L10.9089 0.649756C11.0325 0.526192 11.2267 0.543844 11.3502 0.667408C11.4738 0.790972 11.4562 0.985145 11.3326 1.10871L6.60185 5.55702C6.26647 5.85711 5.73691 5.85711 5.41917 5.55702L0.670776 1.10871C0.600168 1.0381 0.564864 0.967492 0.564864 0.879232Z' />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M1.4719 0.229332L6.00169 4.48868L10.5171 0.24288C10.9015 -0.133119 11.4504 -0.0312785 11.7497 0.267983C12.1344 0.652758 12.0332 1.2069 11.732 1.50812L11.7197 1.52041L6.97862 5.9781C6.43509 6.46442 5.57339 6.47872 5.03222 5.96853C5.03192 5.96825 5.03252 5.96881 5.03222 5.96853L0.271144 1.50833C0.123314 1.3605 -5.04223e-08 1.15353 -3.84322e-08 0.879226C-2.88721e-08 0.660517 0.0936127 0.428074 0.253705 0.267982C0.593641 -0.0719548 1.12269 -0.0699964 1.46204 0.220873L1.4719 0.229332ZM5.41917 5.55702C5.73691 5.85711 6.26647 5.85711 6.60185 5.55702L11.3326 1.10871C11.4562 0.985145 11.4738 0.790972 11.3502 0.667408C11.2267 0.543844 11.0325 0.526192 10.9089 0.649756L6.17821 5.09807C6.07229 5.18633 5.91343 5.18633 5.82517 5.09807L1.09443 0.649756C0.970861 0.543844 0.776689 0.543843 0.653125 0.667408C0.600168 0.720364 0.564864 0.808624 0.564864 0.879232C0.564864 0.967492 0.600168 1.0381 0.670776 1.10871L5.41917 5.55702Z'
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`absolute left-0 z-40 mt-2  rounded border-[.5px] border-black bg-black py-5 shadow-card transition-all ${dropdownOpen
                  ? 'top-full opacity-100 visible'
                  : 'top-[110%] invisible opacity-0 w-full'
                  }`}
              >
                <div id="dropdownSearch" className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700 w-auto">
                </div>
                <ul className="h-48 w-96 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                  {datas.map((item) => {
                    return (
                      <li >
                        <div className="flex pl-6 items-center rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input id={item.id} type="checkbox" onChange={(value) =>handleDeletion(value)} value={item.id} lass="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                          <label for={item.id} className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{dayOfWeek[new Date(item.eventDate).getDay()]}</label>
                          <label for={item.id} className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{item.place.name}</label>
                          <label for={item.id}
                           className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300 p-4 justify-center text-black-600 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0"
                           >{item.deactivatedAt ? 'Desativado' : 'Ativo' }</label>

                          <label for={item.id} className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300 p-4 justify-center text-black-600 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">{item.repeatable?"Repetindo": "Único"}</label>

                        
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <a onClick={sendOfDeletion} className="flex items-center p-3 text-sm font-medium text-red-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline">
                  <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 " />
                  </svg>
                  Desativar / Ativar
                </a>
              </div>
            </div>    
           </div>
        </div>
      </div>
    </div>

  )
};

export default Dropdown3;

