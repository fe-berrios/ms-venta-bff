package bo.felipe.app.service;

import bo.felipe.app.client.IBusinessC;
import bo.felipe.app.model.StatusResponse;
import bo.felipe.app.model.VentaRequest;
import bo.felipe.app.model.VentaResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VentaService {

    @Autowired
    IBusinessC iBusinessC;

    public VentaResponse addVenta(VentaRequest nuevaVenta){
        return iBusinessC.addVenta(nuevaVenta);
    }

    public StatusResponse statusVenta(String token_ws){
        return iBusinessC.statusVenta(token_ws);
    }

}
