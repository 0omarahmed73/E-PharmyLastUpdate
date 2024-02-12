import style from "./Inventory.module.css";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Form, Container, Row, Button, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MedicineContext } from "../../../context/MedicinesContext";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import LinkWithBack from "../../../components/LinkWithBack/LinkWithBack";
import MedicineItem from "../../../components/MedicineItem/MedicineItem";
import { ShowContext } from "../../../context/ShowContext";
import AddWithPrint from "../../../components/AddWithPrint/AddWithPrint";
const Inventory = () => {
  const [searchType, setSearchType] = useState("code");
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const [medicines3, setMedicines3] = useState([]);
  const [data, setData] = useState([]);
  const { loading, setLoading, error, setError, fetchInventory } =
    useContext(MedicineContext);
  const navigate = useNavigate();
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  useEffect(() => {
    const newPrescriptions = [...data];
    if (value.trim() === "") {
      setItems(newPrescriptions);
      return;
    } else if (searchType === "code") {
      const newValue = value;
      const newPrescriptions = data.filter((medicine) => {
        return medicine.barcode.toString().startsWith(newValue);
      });
      setItems(newPrescriptions);
    } else if (searchType === "name") {
      const newValue = value.toLowerCase();
      const newPrescriptions = data.filter((medicine) => {
        return medicine.name.toLowerCase().startsWith(newValue);
      });
      setItems(newPrescriptions);
    }
  }, [value]);
  useEffect(() => {
    const func = async () => {
      setLoading(true);
      try {
        const data = await fetchInventory();
        setData(
          data.map((item) => {
            return {
              barcode: item.medicine.barcode,
              name: item.medicine.name,
              amount: item.amount,
            };
          })
        );
        setItems(
          data.map((item) => {
            return {
              barcode: item.medicine.barcode,
              name: item.medicine.name,
              amount: item.amount,
            };
          })
        );
        setMedicines3(
          data.map((item) => {
            return item.medicine;
          })
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    func();
  }, [fetchInventory]);
  useDocumentTitle(`عهدة المخزن`);
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{ margin: "auto" }}
      className={" d-flex flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <LinkWithBack link="/stock" title={`عهدة المخزن`} />
      <Container className="d-flex justify-content-center align-items-center m-auto">
        <div style={{ width: "90%" }}>
          <Row>
            <Col>
              <Form.Group className={`mt-1`} controlId="search">
                <Form.Control
                  className={`${style.search} `}
                  type="text"
                  style={{ direction: "rtl" }}
                  placeholder={
                    searchType === "code"
                      ? "ادخل الباركود الخاص بالدواء"
                      : searchType === "name"
                      ? "ادخل اسم الدواء"
                      : ""
                  }
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    console.log(value);
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Select
                className="mt-1"
                label="طريقة البحث"
                id="searchType"
                width={"100%"}
                name="searchType"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="code">الباركود الخاص بالدواء</option>
                <option value="name">اسم الدواء</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="w-100 m-0 ">
            <Container className={`${style.container2222} pb-3 pt-1 mt-3`}>
              {loading && !error && items.length <= 0 ? (
                <div className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  جاري التحميل...
                </div>
              ) : !loading && !error && items.length > 0 ? (
                <div
                  className={`${style.rowTitle} d-flex pe-lg-3 pe-2 flex-row  text-white fw-bold mt-2`}
                >
                  <p>كود الدواء</p>
                  <p>اسم الدواء</p>
                  <p>الكمية</p>
                </div>
              ) : error ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
                </p>
              ) : (
                ""
              )}
              {!error && items.length > 0 ? (
                items.map((item, idx) => (
                  <MedicineItem
                    mainType="inventory"
                    className="mb-2"
                    key={item.barcode}
                    id={item.barcode}
                    idx={item.barcode}
                    name={item.name}
                    quantity={item.amount}
                    to={"/stock/medicines/info/" + item.barcode}
                  />
                ))
              ) : !loading && !error && items.length === 0 ? (
                <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
                  عذراً , لا توجد نتائج
                </p>
              ) : (
                ""
              )}
              <AddWithPrint message={"اضافة طلبية جديدة"} link={"/stock/orders/new-order?return=true"} />
            </Container>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default Inventory;
