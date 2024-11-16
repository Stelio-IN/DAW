import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Pages from '../../api/Pages.json';
import Media from '../../pages/media/Media.jsx';
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import Button from "../../components/common/Button.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import Accordion from "../../components/common/Accordion.jsx";
import TextEditor from "../../components/common/TextEditor.jsx";

const EditPage = () => {
  const { pageId } = useParams();
  
  const page = Pages.find((page) => page.id.toString() === pageId.toString());
  
  const [fields, setFields] = useState({
    name: page ? page.title : "",
    description: page ? page.content : "",
    status: page ? page.status : "",
    isFeatured: page ? page.isFeatured : "",
    image: page ? page.image : "",
    pageLayout: page ? page.template : "",
    metaLink: page ? page.url : "",
    metaTitle: page ? page.meta.title : "",
    metaDescription: page ? page.meta.description : "",
  });

  const handleInputChange = (key, value) => {
    setFields({
      ...fields,
      [key]: value,
    });
  };

  const status = [
    { label: "Ativo", value: "active" },
    { label: "Inativo", value: "inactive" },
    { label: "Em espera", value: "on hold" },
    { label: "Descontinuado", value: "discontinued" },
    { label: "Adquirido", value: "acquired" },
    { label: "Fundido", value: "merged" },
    { label: "Extinto", value: "defunct" },
  ];

  const handleStatusChange = (option) => {
    setFields({
      ...fields,
      status: option.label,
    });
  };

  const pageLayoutOptions = [
    { label: "Padrão", value: "default" },
    { label: "Blog Sidebar", value: "blogSidebar" },
    { label: "Tela Cheia", value: "fullWidth" },
    { label: "Página Inicial", value: "homepage" },
    { label: "Em Breve", value: "comingSoon" },
  ];

  const handleSelectPage = (selectedOptions) => {
    setFields({
      ...fields,
      pageLayout: selectedOptions.label,
    });
  };
  const [faqs, setFaqs] = useState(page.faq);

  const handleFaqQuestion = (e) => {
    e.preventDefault();
    if (fields.question && fields.answer) {
      setFaqs([
        ...faqs,
        {
          question: fields.question,
          answer: fields.answer,
        },
      ]);
      setFields({
        ...fields,
        question: "",
        answer: "",
      });
    }
  };
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Detalhes da Página</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Digite o nome da página"
                  label="Nome"
                  value={fields.name}
                  onChange={(value) => handleInputChange("name", value)}
                />
              </div>
              <div className="column">
                <TextEditor
                  label="Descrição"
                  placeholder="Digite uma descrição"
                  value={fields.description}
                  onChange={(value) => handleInputChange("description", value)}
                />
              </div>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Adicionar Pergunta</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Digite a pergunta"
                  icon={<Icons.TbQuestionMark />}
                  label="Pergunta"
                  value={fields.question}
                  onChange={(value) => handleInputChange("question", value)}
                />
              </div>
              <div className="column">
                <Textarea
                  type="text"
                  placeholder="Digite a resposta"
                  icon={<Icons.TbCircleCheck />}
                  label="Resposta"
                  value={fields.answer}
                  onChange={(value) => handleInputChange("answer", value)}
                />
              </div>

              <Button
                label="Adicionar Pergunta"
                icon={<Icons.TbCheck />}
                className="sm right"
                onClick={handleFaqQuestion}
              />
            </div>
            {!faqs.length == 0 ? (
              <div className="content_item">
                <h2 className="sub_heading">Perguntas Frequentes</h2>
                {faqs.map((faq, key) => {
                  return (
                    <div className="column" key={key}>
                      <Accordion title={faq.question}>
                        <p>{faq.answer}</p>
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}

            <div className="content_item meta_data">
              <div className="column">
                <span>Listagem nos motores de busca</span>
                <h2 className="meta_title">
                  {fields.metaTitle || fields.name}
                </h2>
                <p className="meta_link">{fields.metaLink}</p>
                <p className="meta_description">
                  {fields.metaDescription || fields.description}
                </p>
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Digite o título meta"
                  label="Título"
                  value={fields.metaTitle || fields.name}
                  onChange={(value) => handleInputChange("metaTitle", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Digite o link meta"
                  label="Link"
                  value={fields.metaLink}
                  onChange={(value) => handleInputChange("metaLink", value)}
                />
              </div>
              <div className="column">
                <Textarea
                  type="text"
                  placeholder="Digite a descrição meta"
                  label="Descrição"
                  value={fields.metaDescription || fields.description}
                  onChange={(value) =>
                    handleInputChange("metaDescription", value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Publicação</h2>
              <Button
                label="Salvar e Sair"
                className="sm"
                icon={<Icons.TbCircleCheck />}
              />
              <Button
                label="Salvar"
                className="sm success"
                icon={<Icons.TbCircleCheck />}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Status</h2>
              <div className="column">
                <Dropdown
                  placeholder="Selecione o Status"
                  options={status}
                  onClick={handleStatusChange}
                  selectedValue={fields.status}
                />
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Layout da Página</h2>
              <div className="column">
                <Dropdown
                  options={pageLayoutOptions}
                  selectedValue={fields.pageLayout}
                  onClick={handleSelectPage}
                  placeholder="Selecione o Layout"
                />
              </div>
            </div>

            <div className="sidebar_item">
              <h2 className="sub_heading">Imagem da Página</h2>
              <div className="column">
                <Thumbnail onClick={openModal}/>
                 <Modal className="lg" bool={isModalVisible} onClose={closeModal}>
                    <div className="modal-head">
                      <h2>Mídia</h2>
                    </div>
                    <div className="modal-body">
                      <Media/>
                    </div>
                    <div className="modal-footer">
                      <Button
                        label="Fechar"
                        className="outline"
                        onClick={closeModal}
                      />
                      <Button
                        label="Inserir"
                        onClick={closeModal}
                      />
                    </div>
                  </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditPage;
