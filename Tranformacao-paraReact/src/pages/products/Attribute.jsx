import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import List from "../../components/common/List.jsx";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Textarea from "../../components/common/Textarea.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import ProductAttributes from "../../api/ProductAttributes.json";
import TableAction from "../../components/common/TableAction.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";

const Attribute = () => {
  const categories = ProductAttributes;
    const navigate = useNavigate();
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState(5);
  const [tableRow, setTableRow] = useState([
    { value: 2, label: "2" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
  ]);

  const [fields, setFields] = useState({
    name: "",
    description: "",
    status: "",
    isFeatured: false,
    title: "",
    slug: "",
    variations:[
      { id: 1, title: "Red", slug: "red" },
      { id: 2, title: "Blue", slug: "blue" },
    ],
  });

  const variationList = fields.variations.map(variation => variation.title);
  const handleInputChange = (key, value, index) => {
    const updatedVariations = [...fields.variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [key]: value
    };

    setFields({
      ...fields,
      [key]: value,
      variations: updatedVariations
    });
  };

  const statusOptions = [
    { "value": "active", "label": "active" },
    { "value": "completed", "label": "completed" },
    { "value": "new", "label": "new" },
    { "value": "coming soon", "label": "coming soon" },
    { "value": "inactive", "label": "inactive" },
    { "value": "out of stock", "label": "out of stock" },
    { "value": "discontinued", "label": "discontinued" },
    { "value": "on sale", "label": "on sale" },
    { "value": "featured", "label": "featured" },
    { "value": "pending", "label": "pending" },
    { "value": "archive", "label": "archive" },
    { "value": "pause", "label": "pause" }
  ]

  const selectSelect = (selectedOption) => {
    setFields({
      ...fields,
      status: selectedOption.label,
    });
  };

  const bulkAction = [
    { value: "delete", label: "Delete" },
    { value: "attribute", label: "Category" },
    { value: "status", label: "Status" },
  ];

  const bulkActionDropDown = (selectedOption) => {
    console.log(selectedOption);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      fields.forEach((attribute) => {
        updateChecks[attribute.id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckCategory = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const showTableRow = (selectedOption) => {
    setSelectedValue(selectedOption.label);
  };

  const [isModalActive, setModalActive] = useState(false);

  const openModal = () => {
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  const addVariationHandle = () => {
    const newRow = { id: fields.variations.length + 1, title: "", slug: "" };
    setFields({
      ...fields,
      variations:[...fields.variations, newRow]
    })
  }

  const actionItems = ["Delete", "edit"];

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase();
    if (updateItem === "delete") {
      alert(`#${itemID} item delete`);
    } else if (updateItem === "edit") {
      navigate(); // Set you're navigate link
    }
  };
  return (
    <section className="categories">
    <div className="container">
      <div className="wrapper">
        <div className="sidebar">
          <div className="sidebar_item">
            <h2 className="sub_heading">adicionar atributo</h2>
            <div className="column">
              <Input
                type="text"
                placeholder="Insira o nome do campo"
                label="Nome"
                value={fields.name}
                onChange={(value) => handleInputChange("name", value)}
              />
            </div>
            <div className="column">
              <Textarea
                type="text"
                placeholder="Descrição"
                label="Descrição"
                value={fields.description}
                onChange={(value) => handleInputChange("description", value)}
              />
            </div>
            <Divider/>
            <div className="column">
              <Dropdown
                label="Status"
                placeholder="Selecione o Status"
                onClick={selectSelect}
                options={statusOptions}
                selectedValue={fields.status}
              />
            </div>
            <Divider label="lista de variações"/>
            <div className="column">
              <List items={variationList} />
            </div>
            <div className="column">
              <Button
                label="variações"
                className="full info"
                onClick={openModal}
              />
              <Modal bool={isModalActive} onClose={closeModal} className="lg">
                <div className="modal-head">
                  <h2>adicionar variações</h2>
                  <Button
                    label="adicionar"
                    className="right info"
                    onClick={addVariationHandle}
                  />
                </div>
                <div className="modal-body">
                  <table className="bordered">
                    <thead>
                      <tr>
                        <th className="td_id">id</th>
                        <th>nome</th>
                        <th>slug</th>
                        <th>ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.variations.map((variation, key) => {
                        return (
                          <tr key={key}>
                            <td className="td_id">{variation.id}</td>
                            <td>
                              <Input
                                type="text"
                                placeholder="título da variação"
                                value={variation.title}
                                onChange={(value) => handleInputChange("title", value,key)}
                              />
                            </td>
                            <td>
                              <Input
                                placeholder="título da variação"
                                value={variation.slug}
                                onChange={(value) => handleInputChange("slug", value,key)}
                              />
                            </td>
                            <td className="action">
                              <div className="actions">
                                <Button
                                label="excluir"
                                  icon={<Icons.TbTrash />}
                                  className="sm danger"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <Button
                    label="descartar"
                    className="right outline"
                    onClick={closeModal}
                  />
                  <Button
                    label="salvar"
                    className=""
                    onClick={closeModal}
                  />
                </div>
              </Modal>
            </div>
            <Divider/>
            <Button
              label="Descartar"
              className="right outline"
            />
            <Button
              label="salvar"
            />
          </div>
        </div>
        <div className="content transparent">
          <div className="content_head">
            <Dropdown
              placeholder="Ação em Massa"
              className="sm"
              onClick={bulkActionDropDown}
              options={bulkAction}
            />
            <Input
              placeholder="Pesquisar Atributos..."
              className="sm table_search"
            />
            <div className="btn_parent">
              <Link to="/catalog/attribute/add" className="sm button">
                <Icons.TbPlus />
                <span>Criar Atributo</span>
              </Link>
            </div>
          </div>
          <div className="content_body">
            <div className="table_responsive">
              <table className="separate">
                <thead>
                  <tr>
                    <th className="td_checkbox">
                      <CheckBox
                        onChange={handleBulkCheckbox}
                        isChecked={bulkCheck}
                      />
                    </th>
                    <th className="td_id">id</th>
                    <th>nome</th>
                    <th className="td_order">ordem</th>
                    <th className="td_status">status</th>
                    <th className="td_date">criado em</th>
                    <th>ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((attribute, key) => {
                    return (
                      <tr key={key}>
                        <td className="td_checkbox">
                          <CheckBox
                            onChange={(isCheck) =>
                              handleCheckCategory(isCheck, attribute.id)
                            }
                            isChecked={specificChecks[attribute.id] || false}
                          />
                        </td>
                        <td className="td_id">{attribute.id}</td>
                        <td>
                          <Link to={attribute.id}>{attribute.name}</Link>
                        </td>
                        <td className="td_order">{attribute.order}</td>
                        <td className="td_status">
                          {attribute.status.toLowerCase() === "active" ||
                           attribute.status.toLowerCase() === "completed" ||
                           attribute.status.toLowerCase() === "new" ||
                           attribute.status.toLowerCase() === "published" ||
                           attribute.status.toLowerCase() === "coming soon" ? (
                             <Badge
                               label={attribute.status}
                               className="light-success"
                             />
                           ) : attribute.status.toLowerCase() === "inactive" ||
                             attribute.status.toLowerCase() === "out of stock" ||
                             attribute.status.toLowerCase() === "discontinued" ? (
                             <Badge
                               label={attribute.status}
                               className="light-danger"
                             />
                           ) : attribute.status.toLowerCase() === "on sale" ||
                               attribute.status.toLowerCase() === "featured" ||
                               attribute.status.toLowerCase() === "pending" ? (
                             <Badge
                               label={attribute.status}
                               className="light-warning"
                             />
                           ) : attribute.status.toLowerCase() === "archive" ||
                                attribute.status.toLowerCase() === "draft" ||
                               attribute.status.toLowerCase() === "pause" ? (
                             <Badge
                               label={attribute.status}
                               className="light-secondary"
                             />
                           ) : (
                             "Sem status"
                           )}
                        </td>
                        <td className="td_date">{attribute.createdAt}</td>
                        <td className="td_action">
                          <TableAction
                            actionItems={actionItems}
                            onActionItemClick={(item) =>
                              handleActionItemClick(item, attribute.id)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="content_footer">
            <Dropdown
              className="top show_rows sm"
              placeholder="por favor selecione"
              selectedValue={selectedValue}
              onClick={showTableRow}
              options={tableRow}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

};

export default Attribute;
