package bo.felipe.app.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StatusResponse {

    @JsonProperty("vci")
    private String vci;
    @JsonProperty("amount")
    private int amount;
    @JsonProperty("status")
    private String status;
    @JsonProperty("buy_order")
    private String buyOrder;
    @JsonProperty("session_id")
    private String sessionId;
    @JsonProperty("card_detail")
    private StatusCardDetail cardDetail;
    @JsonProperty("accounting_date")
    private String accountingDate;
    @JsonProperty("transaction_date")
    private String transactionDate;
    @JsonProperty("authorization_code")
    private String authorizationCode;
    @JsonProperty("payment_type_code")
    private String paymentTypeCode;
    @JsonProperty("response_code")
    private int responseCode;
    @JsonProperty("installments_number")
    private int installmentsNumber;

}
