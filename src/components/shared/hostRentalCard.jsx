import { React, useContext } from "react";
import { Card, OverlayTrigger, Row, Col } from "react-bootstrap";
import "./hostRentalCard.css";
import { RentalContext } from "../../context/rentalContext";
import { WePopover } from "./wePopover";
import { NotificationContext } from "../../context/notificationContext";

const displayMoney = (amount) => {
  var formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export const HostRentalCard = ({ rental, isUnconfirmed, children }) => {
  const userState = JSON.parse(localStorage.getItem("user-state"));
  const { socket } = useContext(NotificationContext);

  const { updateRental } = useContext(RentalContext);

  const hostUpdateRental = () => {
    const update = async () => {
      const { images, last_update, ...cloneRental } = rental;
      const rentalAfter = {
        ...cloneRental,
        status: isUnconfirmed ? "CONFIRMED" : "RETURNED",
      };
      await updateRental(userState.token, rentalAfter)
        .then((res) => {
          const optionGuest = JSON.stringify({
            forHost: false,
            host_id: rental.host_id,
          });
          const optionHost = JSON.stringify({
            forHost: true,
            client_id: rental.client_id,
          });
          if (res.data) {
            for (let clientId of res.data) {
              socket.emit(
                "send_rental",
                clientId,
                `Chủ nhà ${userState.name} đã từ chối bản thuê của bạn.|${optionGuest}`
              );
            }
          }
          if (rentalAfter.status === "CONFIRMED") {
            socket.emit(
              "send_rental",
              rental.host_id,
              `Cho thuê thành công.|${optionHost}`
            );
          } else if (rentalAfter.status === "RETURNED") {
            socket.emit(
              "send_rental",
              rental.host_id,
              `Trả phòng thành công.|${optionHost}`
            );
          }
          socket.emit(
            "send_rental",
            rental.client_id,
            `Chủ nhà ${userState.name} đã cập nhật trạng thái bản thuê của bạn.|${optionGuest}`
          );
        })
        .catch((err) => {
          console.log(err);
        });
      window.location.reload();
    };
    update();
  };

  return (
    <Card className="host-rental-card mb-2 me-2">
      <Card.Title className="rental-card-title m-2">
        <Row>
          <Col md="10" className="rental-room-name">
            {rental.room_name}
          </Col>
          <Col md="1">
            <OverlayTrigger
              trigger="click"
              placement="right"
              rootClose
              overlay={<WePopover id={rental.client_id} />}
            >
              <span className="bi bi-telephone-outbound-fill"></span>
            </OverlayTrigger>
          </Col>
        </Row>
      </Card.Title>
      <Card.Body>
        <div className="host-rental-cost">{displayMoney(rental.cost)}</div>
        <div className="rental-date-container mt-3">
          <span className="host-rental-date me-3">
            {new Date(rental.begin_date).toLocaleDateString()}
          </span>
          <span>
            {" "}
            <i className="bi bi-caret-right"></i>
          </span>
          <span className="host-rental-date ms-3">
            {new Date(rental.end_date).toLocaleDateString()}
          </span>
        </div>
      </Card.Body>

      <Card.Footer>
        <div onClick={hostUpdateRental}>{children}</div>
      </Card.Footer>
    </Card>
  );
};
