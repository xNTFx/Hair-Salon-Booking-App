import { ServiceRepository } from "../repositories/ServiceRepository";
import { Service } from "../models/Service";

export class ServiceService {
  private repository = new ServiceRepository();

  async getAllServices(): Promise<Service[]> {
    return this.repository.findAll();
  }
}
