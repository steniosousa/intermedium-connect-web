import { useEffect, useState } from "react";
import Line from "../line"
import Solicitation from "../solicitation";
import Api from "../../api/service";
import Schudeles from "../schudeles";
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import Swal from 'sweetalert2'


export function Center({ user }) {
  const [showSolicitation, setShowSolicitation] = useState(false);
  const [copy, setCopy] = useState('Copiar')
  const [dataLine, setDataLine] = useState([])




  async function generatePdf() {
    let dataForPdf;
    const confirm = await Swal.fire({
      icon: 'info',
      title: 'Deseja gerar relatório?',
      showDenyButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })
    if (!confirm.isConfirmed) return
    try {
      const { data } = await Api.get('avaliation/recover', {
        params: {
          userId: user.id
        }
      })
      dataForPdf = data
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Não foi possível recuperar dados para gerar relatório',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
    const pdf = new jsPDF();

    const logoImage = 'data:image/jpeg;base64,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'; // Substitua com o URL da sua imagem
    pdf.addImage(logoImage, 'PNG', 15, 15, 30, 30);

    pdf.setFontSize(12);
    pdf.text(`Intermedium`, 60, 20);

    pdf.setFontSize(10);
    pdf.text('Endereço: R. São José, 40 - Conjunto - Jardim Bandeirantes, Maracanaú - CE, 61934-070', 60, 25)
   
    pdf.setFontSize(10);
    pdf.text('Telefone: (85) 3031-4510', 60, 30)

    pdf.setFontSize(10);
    pdf.text(`Relatório de: ${user.name}`, 15, 55);

    const headers = [['Data', 'Ambiente', 'Objetos', 'Avaliação', 'EPIs', 'Comentário']];

    const datas = dataForPdf.map((item) => {
      const objects = item.ObjectOfCleaning.map((object) => object.object.name).join(', ');

      const equipaments = item.avaliation.EquipmentsOfAvaliation.map((equip) => equip.equipament.name).join(', ');
      const day = new Date(item.createdAt).getDay()
      const month = new Date(item.createdAt).getMonth()
      const year = new Date(item.createdAt).getFullYear()
      return [
        `${day}/${month}/${year}`, item.Place.name, objects, item.avaliation.status, equipaments, item.avaliation.observation
      ]
    })

    pdf.autoTable({
      startY: 60,
      head: headers,
      body: datas,
    });

    pdf.setFontSize(8);
    pdf.text('© 2023 Any Software - Todos os direiros reservados.', 20, pdf.internal.pageSize.height - 10);

    pdf.save('relatorio.pdf');
  }
  function handleSolicitation() {
    getAllDatas()
    setShowSolicitation(!showSolicitation);
  }

  async function copyHash() {
    const copiar = user.loginHash
    try {
      await navigator.clipboard.writeText(copiar);
      setCopy('Copiado')
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao copiar texto para a área de transferência',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }

  async function getAllDatas() {
    try {
      const { data } = await Api.get('/cleaning/recover', {
        params: { userId: user.id }
      });
      setDataLine(data);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao recuperar dados das solicitações',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }

  async function filterCleaning(status) {
    if (status == 'ALL') {
      getAllDatas()
      return
    }
    try {
      const { data } = await Api.get('/cleaning/recover', {
        params: { userId: user.id }
      });
      const filter = data.filter((item) => item.status == status)
      setDataLine(filter);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao recuperar dados das solicitações',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }

  }


  useEffect(() => {
    getAllDatas()
  }, [user])




  return (
    <div className="flex-grow bg-primary text-primary overflow-y-auto">
     {showSolicitation && <Solicitation onClose={handleSolicitation} showModal={showSolicitation} datas={user}/>}
      <div className="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-800 bg-primary text-primary sticky top-0">
        <div className="flex w-full items-center">
          <div className="flex items-center text-3xl text-primary">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" className="w-12 mr-4 rounded-full " alt="profile" />
            {user && user.name}
          </div>
          <div className="ml-auto sm:flex hidden items-center justify-end">
            <div className="text-right">
              <div className="text-xs text-primary">Chave de acesso</div>
              <div className="text-primary text-lg">{user && user.loginHash}</div>
            </div>
            <button onClick={copyHash} className="w-12 h-12 ml-4 text-primary shadow rounded-full flex items-center justify-center border border-gray-200">
              <span>{copy}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3 my-4">

          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium text-primary bg-quaternary  border-b border-black rounded-s-lg focus:z-10 focus:ring-2 focus:text-white  hover:text-white hover:bg-quaternary focus:border-white hover:border-white">
              Histórico
            </button>
            <button onClick={handleSolicitation} type="button" className="px-4 py-2 text-sm font-medium text-primary border-b border-black focus:z-10 focus:ring-2 focus:bg-quaternary focus:text-white  hover:text-white hover:bg-quaternary focus:border-white hover:border-white">
              Agendar
            </button>
          </div>


        </div>
      </div>
      <div className="sm:p-7 p-4">
        <div className="flex w-full items-center mb-7 justify-between">
          <div>
            <select id="countries" onChange={(item) => filterCleaning(item.target.value)} className=" border border-transparent  text-white bg-quaternary outline-transparent text-sm rounded-lg block w-full p-2.5">
              <option value={'ALL'} selected>Tudo</option>
              <option value="PENDENTE">Pendente</option>
              <option value="ASSUMIDO">Assumido</option>
              <option value="CONCLUIDO">Concluído</option>
            </select>
          </div>
          <button onClick={generatePdf} className="text-white inline-flex  bg-green-600 px-16 items-center h-8 w-8 text-base justify-center text-black-600 rounded-md shadow border border-gray-800 leading-none py-0">Relatório</button>
        </div>

        {dataLine.length == 0 ? (
          <div className="text-lg text-center text-white justify-center tracking-wider w-full h-10 ">
            <p>
              - Usuários Sem histórico -</p>
          </div>
        ) : null}
        <table className="w-full text-left">

          <thead>
            <tr className="text-primary">
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-800">Início</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-800">Ambiente</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-800 hidden md:table-cell">Status</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-800">Evidencias</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-800 sm:text-primary">Atualização</th>
            </tr>
          </thead>

          <tbody className="text-primary">
            {dataLine && dataLine.map((clear) => {
              return (
                <Line clean={clear} key={clear.id} />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}