package com.primetrade.bdi.entity;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class StatusConverter implements AttributeConverter<Task.Status, String> {
    @Override
    public String convertToDatabaseColumn(Task.Status status) {
        if(status==null){
            return null;
        }
       return status.getDbValue();// Convert Java TODO to SQL 'To Do'
    }
    @Override
    public Task.Status convertToEntityAttribute(String dbData){
        if(dbData==null){
            return null;
        }
        for(Task.Status status: Task.Status.values()){
            if(status.getDbValue().equals(dbData)){
                return status;
            }
        }
        throw new IllegalArgumentException("Out Of Expertise Value: "+dbData);
    }

}
