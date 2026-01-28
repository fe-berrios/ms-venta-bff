package bo.felipe.app.service;

import bo.felipe.app.client.IBusinessC;
import bo.felipe.app.model.VentaRequest;
import bo.felipe.app.model.VentaResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class VentaService {

    @Autowired
    IBusinessC iBusinessC;

    public VentaResponse addVenta(VentaRequest nuevaVenta){
        return iBusinessC.addVenta(nuevaVenta);
    }


}
