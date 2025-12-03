import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, Smartphone, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const DigitalPayments = () => {
  const { toast } = useToast();

  const handleMakePayment = () => {
    toast({
      title: "Make Payment",
      description: "Opening UPI payment interface...",
    });
  };

  const handleRequestPayment = () => {
    toast({
      title: "Request Payment",
      description: "Creating payment request link...",
    });
  };

  const handleApplyLoan = () => {
    toast({
      title: "Loan Application",
      description: "Starting microloan application process...",
    });
  };

  const handleViewTransactions = () => {
    toast({
      title: "Transaction History",
      description: "Loading complete transaction history...",
    });
  };

  const paymentDetails = {
    upiId: "sahanan8668@naviaxis",
    merchantName: "AgriConnect Platform",
    verified: true
  };

  const recentTransactions = [
    { id: "TXN001", amount: "₹5,400", date: "Nov 13, 2025", status: "Completed" },
    { id: "TXN002", amount: "₹12,800", date: "Nov 12, 2025", status: "Completed" },
    { id: "TXN003", amount: "₹3,200", date: "Nov 10, 2025", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Digital Payments
          </h1>
          <p className="text-muted-foreground text-lg">
            Secure payment processing with transparent transaction history
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Smartphone className="w-8 h-8 text-primary mb-2" />
              <CardTitle>UPI Payment Details</CardTitle>
              <CardDescription>Quick and secure payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">UPI ID</span>
                  {paymentDetails.verified && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="font-mono text-lg font-semibold">
                  {paymentDetails.upiId}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {paymentDetails.merchantName}
                </p>
              </div>
              <Button className="w-full" variant="default" onClick={handleMakePayment}>
                Make Payment
              </Button>
              <Button className="w-full" variant="outline" onClick={handleRequestPayment}>
                Request Payment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CreditCard className="w-8 h-8 text-success mb-2" />
              <CardTitle>Microloan Options</CardTitle>
              <CardDescription>Access credit for your farming needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">₹50K</div>
                  <div className="text-sm text-muted-foreground">Available Credit</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-success">8.5%</div>
                  <div className="text-sm text-muted-foreground">Interest Rate</div>
                </div>
              </div>
              <Button className="w-full" variant="hero" onClick={handleApplyLoan}>
                Apply for Loan
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <DollarSign className="w-8 h-8 text-earth mb-2" />
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>View your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{txn.id}</div>
                    <div className="text-sm text-muted-foreground">{txn.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{txn.amount}</div>
                    <Badge variant={txn.status === "Completed" ? "default" : "secondary"}>
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={handleViewTransactions}>
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default DigitalPayments;
