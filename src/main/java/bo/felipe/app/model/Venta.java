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
public class Venta {

    @JsonProperty("buy_order")
    private String buyOrder;
    @JsonProperty("session_id")
    private String sessionId;
    @JsonProperty("amount")
    private int amount;
    @JsonProperty("return_url")
    private String returnUrl;
    @JsonProperty("token")
    private String token;
    @JsonProperty("url")
    private String url;
    @JsonProperty("status")
    private String status;
    @JsonProperty("authorization_code")
    private String authorizationCode;


}
