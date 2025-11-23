// ===== STREETWASH PORTO ALEGRE - SISTEMA COMPLETO =====
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🚗 StreetWash POA - Sistema iniciado!');
    
    // ===== PREÇOS REAIS =====
    const prices = {
        basic: { carro: 30, suv: 40, moto: 15 },
        premium: { carro: 55, suv: 65, moto: 40 },
        complete: { carro: 85, suv: 95, moto: 70 }
    };

    // ===== CONTADOR DE CARROS ANIMADO =====
    let carCount = 0;
    const targetCount = Math.floor(Math.random() * 40) + 25; // 25-65 carros
    const countElement = document.getElementById('carCount');
    
    const countInterval = setInterval(() => {
        carCount++;
        countElement.textContent = carCount;
        countElement.style.transform = 'scale(1.1)';
        setTimeout(() => countElement.style.transform = 'scale(1)', 100);
        
        if (carCount >= targetCount) {
            clearInterval(countInterval);
            // Manter contagem animada
            setInterval(() => {
                carCount += Math.floor(Math.random() * 3);
                countElement.textContent = carCount;
            }, 30000); // +1-3 carros a cada 30 segundos
        }
    }, 80);

    // ===== SISTEMA DE AGENDAMENTO =====
    let currentStep = 1;
    let selectedService = null;
    let selectedVehicle = null;

    // Elementos do modal
    const modal = document.getElementById('bookingModal');
    const steps = document.querySelectorAll('.booking-step');
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const closeBtn = document.getElementById('closeModal');

    // Seleção de serviços
    document.querySelectorAll('.service-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.service-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedService = this.dataset.service;
            console.log('Serviço selecionado:', selectedService);
        });
    });

    // Seleção de veículos
    document.querySelectorAll('.vehicle-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.vehicle-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedVehicle = this.dataset.vehicle;
            console.log('Veículo selecionado:', selectedVehicle);
        });
    });

    // Navegação do modal
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    closeBtn.addEventListener('click', closeModal);

    function nextStep() {
        if (currentStep === 1 && !selectedService) {
            showNotification('Por favor, selecione um serviço');
            return;
        }
        if (currentStep === 2 && !selectedVehicle) {
            showNotification('Por favor, selecione um veículo');
            return;
        }

        steps[currentStep - 1].classList.remove('active');
        currentStep++;
        
        if (currentStep === 3) {
            updateOrderSummary();
        }
        
        steps[currentStep - 1].classList.add('active');
        updateNavigation();
    }

    function prevStep() {
        steps[currentStep - 1].classList.remove('active');
        currentStep--;
        steps[currentStep - 1].classList.add('active');
        updateNavigation();
    }

    function updateNavigation() {
        prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
        nextBtn.style.display = currentStep < 3 ? 'flex' : 'none';
        
        if (currentStep === 3) {
            nextBtn.style.display = 'none';
        }
    }

    function updateOrderSummary() {
        if (!selectedService || !selectedVehicle) return;
        
        const price = prices[selectedService][selectedVehicle];
        const serviceNames = {
            basic: 'Lavagem Express',
            premium: 'Lavagem Premium', 
            complete: 'Lavagem Completa'
        };
        const vehicleNames = {
            carro: 'Carro Popular',
            suv: 'SUV/Utilitário',
            moto: 'Moto'
        };

        const serviceDescription = {
            basic: 'Lavagem externa + secagem rápida (15-20min)',
            premium: 'Lavagem completa + cera + aspiração (30-40min)',
            complete: 'Serviço premium + interior detalhado (45-60min)'
        };

        document.getElementById('orderSummary').innerHTML = `
            <div style="background: var(--dark-surface); padding: 25px; border-radius: 12px; border: 1px solid var(--border-dark);">
                <h4 style="color: var(--primary-green); margin-bottom: 15px;">📋 Resumo do Agendamento</h4>
                <div style="display: grid; gap: 10px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-gray);">Serviço:</span>
                        <span style="color: var(--text-light); font-weight: 600;">${serviceNames[selectedService]}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-gray);">Veículo:</span>
                        <span style="color: var(--text-light); font-weight: 600;">${vehicleNames[selectedVehicle]}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-gray);">Descrição:</span>
                        <span style="color: var(--text-light); font-size: 0.9em; text-align: right;">${serviceDescription[selectedService]}</span>
                    </div>
                    <div style="border-top: 1px solid var(--border-dark); padding-top: 10px; margin-top: 10px;">
                        <div style="display: flex; justify-content: space-between; font-size: 1.2em;">
                            <span style="color: var(--text-light); font-weight: 700;">Total:</span>
                            <span style="color: var(--primary-green); font-weight: 800;">R$ ${price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Confirmar agendamento via WhatsApp
    document.getElementById('confirmBooking').addEventListener('click', function() {
        if (!selectedService || !selectedVehicle) {
            showNotification('Por favor, complete todas as etapas');
            return;
        }

        const phone = '5551999522076';
        const price = prices[selectedService][selectedVehicle];
        const serviceNames = {
            basic: 'Lavagem Express', premium: 'Lavagem Premium', complete: 'Lavagem Completa'
        };
        const vehicleNames = {
            carro: 'Carro Popular', suv: 'SUV/Utilitário', moto: 'Moto'
        };

        const message = `Olá! Gostaria de agendar uma *${serviceNames[selectedService]}* para meu *${vehicleNames[selectedVehicle]}* (R$ ${price}).\n\nPodem me confirmar o horário disponível?`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        showNotification('Redirecionando para WhatsApp...');
        setTimeout(closeModal, 1000);
    });

    // ===== CALCULADORA DE PREÇOS =====
    window.calculatePrice = function() {
        const service = document.getElementById('serviceType').value;
        const vehicle = document.getElementById('vehicleType').value;
        const resultDiv = document.getElementById('priceResult');

        if (!service || !vehicle) {
            resultDiv.innerHTML = '<div style="color: #ff6b6b; text-align: center; padding: 20px;">⚠️ Selecione o serviço e o veículo</div>';
            return;
        }

        const price = prices[service][vehicle];
        const vehicleText = vehicle === 'carro' ? 'Carro Popular' : 
                           vehicle === 'suv' ? 'SUV/Utilitário' : 'Moto';
        
        resultDiv.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 0.9em; color: var(--text-gray); margin-bottom: 10px;">Preço para ${vehicleText}</div>
                <div class="final-price">R$ ${price}</div>
                <div style="font-size: 0.8em; color: var(--text-gray); margin-top: 10px;">
                    💰 Preço final sem taxas extras<br>
                    ⏱️ Entrega rápida e com qualidade
                </div>
            </div>
        `;
    };

    // ===== FORMULÁRIO DE CONTATO =====
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        
        const message = `Olá! Sou *${name}* (${phone}). Gostaria de mais informações sobre: ${service}.`;
        const whatsappUrl = `https://wa.me/5551999522076?text=${encodeURIComponent(message)}`;
        
        showNotification('Redirecionando para WhatsApp...');
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1000);
    });

    // ===== FUNÇÕES AUXILIARES =====
    function showNotification(message) {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-green);
            color: var(--dark-bg);
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: var(--shadow-hover);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // ===== ANIMAÇÕES AO SCROLL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.filter = 'blur(0px)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.filter = 'blur(2px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // ===== SCROLL SUAVE =====
    window.scrollToServices = function() {
        document.getElementById('servicos').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

});

// ===== FUNÇÕES GLOBAIS =====
function openBooking() {
    document.getElementById('bookingModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset do modal
    const modal = document.getElementById('bookingModal');
    document.querySelectorAll('.booking-step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
    });
    document.querySelectorAll('.service-option, .vehicle-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    currentStep = 1;
    selectedService = null;
    selectedVehicle = null;
    document.getElementById('prevStep').style.display = 'none';
    document.getElementById('nextStep').style.display = 'flex';
}

// Mensagem de console profissional
console.log(`%c
╔══════════════════════════════════════╗
║                                      ║
║         🚗 STREETWASH POA 🚗         ║
║     Lavagem Profissional - POA       ║
║         Sistema Ativado!             ║
║                                      ║
║   📞 Telefone: +55 51 9952-2076      ║
║   📍 Porto Alegre/RS                 ║
║   🕒 Horário: Seg-Sex 8h-19h         ║
║                                      ║
╚══════════════════════════════════════╝
`, 'color: #00ff88; font-family: monospace;');
        