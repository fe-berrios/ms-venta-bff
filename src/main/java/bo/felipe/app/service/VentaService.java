package bo.felipe.app.service;

import bo.felipe.app.client.IBusinessC;
import bo.felipe.app.model.StatusResponse;
import bo.felipe.app.model.Venta;
import bo.felipe.app.model.VentaRequest;
import bo.felipe.app.model.VentaResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VentaService {

    @Autowired
    IBusinessC iBusinessC;

    // C
    public VentaResponse addVenta(VentaRequest nuevaVenta){
        return iBusinessC.addVenta(nuevaVenta);
    }

    // R
    public Venta getVentaByBO(String buy_order){
        return iBusinessC.getVentaByBO(buy_order);
    }

    // U
    public Venta updateVenta(String buy_order, Venta venta){
        return iBusinessC.updateVenta(buy_order, venta);
    }

    // D
    public void deleteVenta(Long id){
        iBusinessC.deleteVenta(id);
    }

    // Confirmar
    public StatusResponse statusVenta(String token_ws){
        return iBusinessC.statusVenta(token_ws);
    }

}
